"""Optimization: hyperparameter tuning for models."""

import psutil
import torch

from pytorch_lightning import Trainer
from pytorch_lightning.callbacks import EarlyStopping

import ray
from ray import tune
from ray.tune.schedulers import ASHAScheduler
from ray.tune.search.optuna import OptunaSearch

from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.neighbors import KNeighborsRegressor, KNeighborsClassifier
from sklearn.svm import SVR, SVC

from Define import PROBLEM, MODEL, GetProblem
from Training import GetDataloader, Net, Predict


def Optimize(df, paramDict):
    """Run hyperparameter optimization for the given model."""
    config = {}
    # Define search space by model type
    if paramDict["model"] == MODEL.nn.value:
        # NN: index of last layer (1–5), layer type, param, activation per layer
        config.update({"last": tune.qrandint(1, 5, 1)})
        for idx in range(1, 6):
            config.update({
                f"layer{idx}": tune.choice(["fully", "batch", "dropout"]),
                f"param{idx}": tune.choice([10, 30, 50, 70, 100]),
                f"af{idx}": tune.choice(["relu", "tanh", "none"])})
        config.update({"optimizer": tune.choice(["sgd", "momentum", "rmsprop", "adam"])})
        config.update({"lr": tune.choice([0.001, 0.005, 0.01, 0.05, 0.1])})
        config.update({"miniBatch": tune.choice([8, 32, 64, 96])})
    elif paramDict["model"] == MODEL.rf.value:
        config.update({"n_estimators": tune.choice([10, 50, 100, 200, 500, 1000])})
        config.update({"max_features": tune.choice(["sqrt", "log2", None])})
        config.update({"max_depth": tune.choice([5, 10, 20, 30, None])})
        config.update({"min_samples_split": tune.choice([2, 5, 7, 10])})
    elif paramDict["model"] == MODEL.svm.value:
        config.update({"kernel": tune.choice(["rbf", "linear", "poly", "sigmoid"])})
        config.update({"C": tune.choice([0.1, 1, 10, 100])})
        config.update({"gamma": tune.choice([0.001, 0.01, 0.1, 1, "scale"])})
    else:
        # k-NN
        config.update({"n_neighbors": tune.choice([3, 5, 7, 10])})
        config.update({"weights": tune.choice(["uniform", "distance"])})
        config.update({"algorithm": tune.choice(["auto", "ball_tree", "kd_tree", "brute"])})
        config.update({"metric": tune.choice(["euclidean", "manhattan", "chebyshev"])})

    # Select training function for the model type
    if paramDict["model"] == MODEL.nn.value:
        train_func = lambda cfg: TrainingFunc_Nn(cfg, df, paramDict)
    else:
        train_func = lambda cfg: TrainingFunc_Trdt(cfg, df, paramDict)

    # Run Ray Tune with ASHA scheduler and Optuna search
    num_cpus = psutil.cpu_count(logical=False)
    num_gpus = torch.cuda.device_count()
    ray.init(num_cpus=num_cpus, num_gpus=num_gpus, logging_level="INFO", log_to_driver=True, logging_format="text")
    analysis = tune.run(
        train_func, config=config, num_samples=50, resources_per_trial={"cpu": num_cpus, "gpu": num_gpus},
        scheduler=ASHAScheduler(metric="loss", mode="min", max_t=50, grace_period=5, reduction_factor=2),
        search_alg=OptunaSearch(metric="loss", mode="min"))
    best_config = analysis.get_best_config(metric="loss", mode="min")
    ray.shutdown()
    return best_config


def TrainingFunc_Nn(config, df, paramDict):
    """NN training function for hyperparameter search."""
    # Map Ray Tune config into paramDict format for each layer (1–5)
    for idx in range(1, 6):
        # Mark layers up to config["last"] as non-terminal
        if idx < config["last"]:
            paramDict[f"last{idx}"] = False
        else:
            paramDict[f"last{idx}"] = True
        paramDict[f"layer{idx}"] = config[f"layer{idx}"]
        paramDict[f"param{idx}"] = config[f"param{idx}"]
        # Dropout param is stored as 0–100 in tune; convert to rate 0–1
        if paramDict[f"layer{idx}"] == "dropout":
            paramDict[f"param{idx}"] /= 100
            if paramDict[f"param{idx}"] == 1:
                paramDict[f"param{idx}"] = 0.99
        paramDict[f"af{idx}"] = config[f"af{idx}"]
    paramDict["optimizer"] = config["optimizer"]
    paramDict["lr"] = config["lr"]
    # Build model and train with early stopping
    problem, uniqueNum = GetProblem(df, paramDict["target"])
    num_features, train_loader, val_loader, _ = GetDataloader(df, problem, paramDict["target"], config["miniBatch"])
    model = Net(num_features, paramDict, problem, uniqueNum)
    earlyStopCallback = EarlyStopping(monitor="val_loss", min_delta=0.0, patience=5, verbose=True, mode="min")
    trainer = Trainer(callbacks=[earlyStopCallback], max_epochs=50)
    trainer.fit(model, train_loader, val_loader)
    tune.report(loss=trainer.callback_metrics["val_loss"].item())


def TrainingFunc_Trdt(config, df, paramDict):
    """Traditional model training function for hyperparameter search."""
    problem, _ = GetProblem(df, paramDict["target"])
    # Instantiate model by type (RF / SVM / k-NN) and problem (regression / classification)
    if paramDict["model"] == MODEL.rf.value:
        if problem == PROBLEM.regression:
            model = RandomForestRegressor(
                n_estimators=config["n_estimators"],
                max_features=config["max_features"],
                max_depth=config["max_depth"],
                min_samples_split=config["min_samples_split"],
                random_state=0)
        else:
            model = RandomForestClassifier(
                n_estimators=config["n_estimators"],
                max_features=config["max_features"],
                max_depth=config["max_depth"],
                min_samples_split=config["min_samples_split"],
                random_state=0)
    elif paramDict["model"] == MODEL.svm.value:
        if problem == PROBLEM.regression:
            model = SVR(
                kernel=config["kernel"],
                C=config["C"],
                gamma=config["gamma"],
                random_state=0)
        else:
            model = SVC(
                kernel=config["kernel"],
                C=config["C"],
                gamma=config["gamma"],
                probability=True,
                random_state=0)
    else:
        # k-NN
        if problem == PROBLEM.regression:
            model = KNeighborsRegressor(
                n_neighbors=config["n_neighbors"],
                weights=config["weights"],
                algorithm=config["algorithm"],
                metric=config["metric"])
        else:
            model = KNeighborsClassifier(
                n_neighbors=config["n_neighbors"],
                weights=config["weights"],
                algorithm=config["algorithm"],
                metric=config["metric"])
    # Predict and report loss for tuning
    metrics = Predict(df, paramDict["target"], model, problem)
    tune.report(loss=metrics[0][0])
