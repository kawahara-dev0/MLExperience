"""Training: model training (NN and traditional models)."""
import math
import numpy as np
import psutil

import pytorch_lightning as pl
from pytorch_lightning import Trainer
from pytorch_lightning.callbacks import EarlyStopping

from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, log_loss, accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor, KNeighborsClassifier
from sklearn.svm import SVR, SVC

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset, random_split
from torchmetrics import Accuracy, Precision, Recall, F1Score

from Define import PROBLEM, MODEL, GetProblem


def ExecTraining_Nn(df, paramDict):
    """Run NN training."""
    problem, uniqueNum = GetProblem(df, paramDict["target"])
    numFeatures, trainLoader, valLoader, testLoader = GetDataloader(df, problem, paramDict["target"], paramDict["miniBatch"])
    model = Net(numFeatures, paramDict, problem, uniqueNum)
    earlyStopCallback = EarlyStopping(monitor="val_loss", min_delta=0.0, patience=5, verbose=True, mode="min")
    trainer = Trainer(callbacks=[earlyStopCallback], max_epochs=(paramDict["epoch"] - 1), log_every_n_steps=len(trainLoader))
    trainer.fit(model, trainLoader, valLoader)
    trainer.test(model, testLoader)
    valMetrics = model.metrics["val"]["epoch"]
    testMetrics = model.metrics["test"]["epoch"]
    import math
    valLosses = [round(loss, 2) if math.isfinite(loss) else 0.0 for loss in valMetrics["losses"]]
    testLoss = round(testMetrics["losses"][0], 2) if math.isfinite(testMetrics["losses"][0]) else 0.0
    if problem == PROBLEM.regression:        
        import math
        yPred = [round(pred, 2) if math.isfinite(pred) else 0.0 for pred in model.yPred]
        yTest = [round(test, 2) if math.isfinite(test) else 0.0 for test in model.yTest]
        
        return [valLosses, [], [testLoss], [yPred, yTest]]
    else:
        import math
        valAccs = [v for v in valMetrics["accs"] if math.isfinite(v)]
        valPrecs = [v for v in valMetrics["precs"] if math.isfinite(v)]
        valRecs = [v for v in valMetrics["recs"] if math.isfinite(v)]
        valF1s = [v for v in valMetrics["f1s"] if math.isfinite(v)]
        
        valAccMax = round(max(valAccs) * 100) if valAccs else 0
        valPrecMax = round(max(valPrecs) * 100) if valPrecs else 0
        valRecMax = round(max(valRecs) * 100) if valRecs else 0
        valF1Max = round(max(valF1s) * 100) if valF1s else 0
        testAcc = round(testMetrics["accs"][0] * 100) if math.isfinite(testMetrics["accs"][0]) else 0
        testPrec = round(testMetrics["precs"][0] * 100) if math.isfinite(testMetrics["precs"][0]) else 0
        testRec = round(testMetrics["recs"][0] * 100) if math.isfinite(testMetrics["recs"][0]) else 0
        testF1 = round(testMetrics["f1s"][0] * 100) if math.isfinite(testMetrics["f1s"][0]) else 0
        return [valLosses,
                [valAccMax, valPrecMax, valRecMax, valF1Max],
                [testLoss, testAcc, testPrec, testRec, testF1],
                [model.yPred, model.yTest]]
    
    
def GetDataloader(df, problem, target, miniBatch):
    """Build train/val/test dataloaders."""
    x = torch.tensor(df.drop(columns=[target]).values, dtype=torch.float32)
    if problem == PROBLEM.regression:
        t = torch.tensor(df[target].values, dtype=torch.float32)
    else:
        t = torch.tensor(df[target].values, dtype=torch.int64)
    dataset = TensorDataset(x, t)
    numFeatures = x.shape[1]
    torch.manual_seed(0)
    valTestSize = math.floor(len(dataset) * 0.2)
    train, val, test = random_split(dataset, [len(dataset) - (valTestSize * 2), valTestSize, valTestSize])
    num_workers = round((psutil.cpu_count(logical=False) + torch.cuda.device_count()) / 2 + 0.1)
    trainLoader = DataLoader(train, miniBatch, shuffle=True, drop_last=True, num_workers=num_workers, persistent_workers=True)
    valLoader = DataLoader(val, miniBatch, num_workers=num_workers, persistent_workers=True)
    testLoader = DataLoader(test, miniBatch, num_workers=num_workers, persistent_workers=True)
    return numFeatures, trainLoader, valLoader, testLoader


class Net(pl.LightningModule):
    """Neural network model (PyTorch Lightning)."""
    def __init__(self, numFeatures, paramDict, problem, uniqueNum):
        super().__init__()
        prevOutputSize = numFeatures
        for idx in range(1, 6):
            if (idx > 1) and (paramDict[f"last{idx - 1}"]):
                setattr(self, f"layer{idx}", lambda x: x)
                setattr(self, f"af{idx}", lambda x: x)
            else:
                if paramDict[f"layer{idx}"] == "fully":
                    setattr(self, f"layer{idx}", nn.Linear(prevOutputSize, int(paramDict[f"param{idx}"])))
                    prevOutputSize = int(paramDict[f"param{idx}"])
                elif paramDict[f"layer{idx}"] == "batch":
                    setattr(self, f"layer{idx}", nn.BatchNorm1d(prevOutputSize))
                else:
                    setattr(self, f"layer{idx}", nn.Dropout(p=float(paramDict[f"param{idx}"])))
                if paramDict[f"af{idx}"] == "relu":
                    setattr(self, f"af{idx}", F.relu)
                elif paramDict[f"af{idx}"] == "tanh":
                    setattr(self, f"af{idx}", F.tanh)
                else:
                    setattr(self, f"af{idx}", lambda x: x)
        if problem == PROBLEM.regression:
            self.layerLast = nn.Linear(prevOutputSize, 1)
            self.lf = self.RMSE
        else:
            self.layerLast = nn.Linear(prevOutputSize, uniqueNum)
            self.lf = F.cross_entropy
        self.optimizer = paramDict["optimizer"]
        self.lr = paramDict["lr"]
        self.yPred = []
        self.yTest = []
        if uniqueNum == 2:
            self.acc = Accuracy(task="binary")
            self.precision = Precision(task="binary", average="macro")
            self.recall = Recall(task="binary", average="macro")
            self.f1score = F1Score(task="binary", average="macro")
        elif uniqueNum > 2:
            self.acc = Accuracy(task="multiclass", num_classes=uniqueNum)
            self.precision = Precision(task="multiclass", num_classes=uniqueNum, average="macro")
            self.recall = Recall(task="multiclass", num_classes=uniqueNum, average="macro")
            self.f1score = F1Score(task="multiclass", num_classes=uniqueNum, average="macro")
        self.metrics = GetMetricsDict()
        self.uniqueNum = uniqueNum

    def RMSE(self, y_pred, y_true):
        return torch.sqrt(F.mse_loss(y_pred, y_true))

    def forward(self, x):
        z = self.af1(self.layer1(x))
        z = self.af2(self.layer2(z))
        z = self.af3(self.layer3(z))
        z = self.af4(self.layer4(z))
        z = self.af5(self.layer5(z))
        return self.layerLast(z)

    def ProcStep(self, batch, learnPhase):
        x, yTest = batch
        yPred = self(x)
        if self.uniqueNum < 2:
            yPred_for_loss = yPred.squeeze()
            loss = self.lf(yPred_for_loss, yTest)
        else:
            loss = self.lf(yPred, yTest)
        metrics = self.metrics[learnPhase]["step"]
        metrics["losses"].append(loss)
        if self.uniqueNum >= 2:
            if self.uniqueNum == 2:
                yPredArgmax = torch.argmax(yPred, axis=1)
                acc = self.acc(yPredArgmax, yTest)
                prec = self.precision(yPredArgmax, yTest)
                rec = self.recall(yPredArgmax, yTest)
                f1 = self.f1score(yPredArgmax, yTest)
            else:
                acc = self.acc(yPred, yTest)
                prec = self.precision(yPred, yTest)
                rec = self.recall(yPred, yTest)
                f1 = self.f1score(yPred, yTest)
            metrics["accs"].append(acc)
            metrics["precs"].append(prec)
            metrics["recs"].append(rec)
            metrics["f1s"].append(f1)
        if learnPhase == "test":
            self.yTest.extend(yTest.tolist())
            if self.uniqueNum < 2:
                yPred_squeezed = yPred.squeeze()
                self.yPred.extend(yPred_squeezed.tolist())
            else:
                yPredArgmax = torch.argmax(yPred, axis=1)
                self.yPred.extend(yPredArgmax.tolist())
        return loss

    def ProcEpoch(self, learnPhase):
        stepMetrics = self.metrics[learnPhase]["step"]
        avg_loss = torch.stack(stepMetrics["losses"]).mean()
        epochMetrics = self.metrics[learnPhase]["epoch"]
        epochMetrics["losses"].append(avg_loss.item())
        if learnPhase == "val":
            self.log("val_loss", avg_loss.item())
        if self.uniqueNum >= 2:
            avg_acc = torch.stack(stepMetrics["accs"]).mean()
            avg_prec = torch.stack(stepMetrics["precs"]).mean()
            avg_rec = torch.stack(stepMetrics["recs"]).mean()
            avg_f1 = torch.stack(stepMetrics["f1s"]).mean()

            epochMetrics["accs"].append(avg_acc.item())
            epochMetrics["precs"].append(avg_prec.item())
            epochMetrics["recs"].append(avg_rec.item())
            epochMetrics["f1s"].append(avg_f1.item())
        stepMetrics = GetMetricsDict_Main()

    def training_step(self, batch, batch_idx):
        return self.ProcStep(batch, "train")

    def on_train_epoch_end(self):
        self.ProcEpoch("train")

    def validation_step(self, batch, batch_idx):
        return self.ProcStep(batch, "val")

    def on_validation_epoch_end(self):
        self.ProcEpoch("val")

    def test_step(self, batch, batch_idx):
        return self.ProcStep(batch, "test")

    def on_test_epoch_end(self):
        self.ProcEpoch("test")

    def configure_optimizers(self):
        if self.optimizer == "sgd":
            optimizer = torch.optim.SGD(self.parameters(), lr=self.lr)
        elif self.optimizer == "momentum":
            optimizer = torch.optim.SGD(self.parameters(), lr=self.lr, momentum=0.9)
        elif self.optimizer == "rmsprop":
            optimizer = torch.optim.RMSprop(self.parameters(), lr=self.lr)
        else:
            optimizer = torch.optim.Adam(self.parameters(), lr=self.lr)

        return optimizer


def GetMetricsDict():
    return {
        "train": GetMetricsDict_Steps(),
        "val": GetMetricsDict_Steps(),
        "test": GetMetricsDict_Steps()
    }


def GetMetricsDict_Steps():
    return {
        "step": GetMetricsDict_Main(),
        "epoch": GetMetricsDict_Main()
    }


def GetMetricsDict_Main():
    return {"losses": [], "accs": [], "precs": [], "recs": [], "f1s": []}


def ExecTraining_Trdt(df, paramDict):
    """Run training for traditional (non-NN) models."""
    problem, _ = GetProblem(df, paramDict["target"])

    if paramDict["model"] == MODEL.rf.value:
        if paramDict["maxFeatures"] == "none":
            maxFeatures = None
        else:
            maxFeatures = paramDict["maxFeatures"]
            
        if paramDict["maxDepth"] == 0:
            maxDepth = None
        else:
            maxDepth = paramDict["maxDepth"]
        if problem == PROBLEM.regression:
            model = RandomForestRegressor(n_estimators=paramDict["nEstimators"], max_features=maxFeatures,
                                          max_depth=maxDepth, min_samples_split=paramDict["minSamplesSplit"],
                                          random_state=0)
        else:
            model = RandomForestClassifier(n_estimators=paramDict["nEstimators"], max_features=maxFeatures,
                                           max_depth=maxDepth, min_samples_split=paramDict["minSamplesSplit"],
                                           random_state=0)
    elif paramDict["model"] == MODEL.svm.value:
        if paramDict["gamma"] == 0:
            gamma = "scale"
        else:
            gamma = paramDict["gamma"]
            
        if problem == PROBLEM.regression:
            model = SVR(kernel=paramDict["kernel"], C=paramDict["c"], gamma=gamma)
        else:
            model = SVC(kernel=paramDict["kernel"], C=paramDict["c"], gamma=gamma, probability=True)
    else:
        if problem == PROBLEM.regression:
            model = KNeighborsRegressor(n_neighbors=paramDict["nNeighbors"], weights=paramDict["weights"],
                                        algorithm=paramDict["algorithm"], metric=paramDict["metric"])
        else:
            model = KNeighborsClassifier(n_neighbors=paramDict["nNeighbors"], weights=paramDict["weights"],
                                         algorithm=paramDict["algorithm"],                                          metric=paramDict["metric"])
    return Predict(df, paramDict["target"], model, problem)


def Predict(df, target, model, problem):
    """Train model and predict target; return metrics and predictions."""
    x = df.drop(columns=[target]).values
    y = df[target].values
    xTrain, xTest, yTrain, yTest = train_test_split(x, y, test_size=0.3, random_state=0)
    model.fit(xTrain, yTrain)
    if problem == PROBLEM.regression:
        yPred = model.predict(xTest)
        loss = round(math.sqrt(mean_squared_error(yTest, yPred)), 2)
        yPredRes = [round(pred, 2) for pred in yPred.tolist()]
        yTestRes = [round(test, 2) for test in yTest.tolist()]
        
        return [[loss], [yPredRes, yTestRes]]
    else:
        yProba = model.predict_proba(xTest)
        loss = round(log_loss(yTest, yProba, labels=list(range(yProba.shape[1]))), 2)
        
        yProbaArgmax = np.argmax(yProba, axis=1)
        acc = round(accuracy_score(yTest, yProbaArgmax) * 100)
        prec = round(precision_score(yTest, yProbaArgmax, average="macro", zero_division=0.0) * 100)
        rec = round(recall_score(yTest, yProbaArgmax, average="macro", zero_division=0.0) * 100)
        f1 = round(f1_score(yTest, yProbaArgmax, average="macro", zero_division=0.0) * 100)
        return [[loss, acc, prec, rec, f1], [yProbaArgmax.tolist(), yTest.tolist()]]
