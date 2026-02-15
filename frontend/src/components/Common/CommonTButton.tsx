/** Shared toggle button component. */
import { useContext } from "react";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import { ModelContext, INPUT_DATA, MODEL, LAYER, AF, OPTIMIZER, MAX_FEATURES, KERNEL,
         WEIGHTS, ALGORITHM, METRIC, CONFIG_KEY, SIV_fully, SIV_dropout } from "../index";

export default function CommonTButton(props: {
  configKey: CONFIG_KEY;
  preSelectDataUS?: { preSelectData: string; SetPreSelectData: (value: INPUT_DATA) => void; };
  nnDetailIdx?: number;
}) {
  const { nnDetailIdx = 0 } = props;
  const { model, SetModelVal, nnDetails, SetNnDetail, optimizer, SetOptimizer,
          rfHparam, SetRfHparam, svmHparam, SetSvmHparam, knnHparam, SetKnnHparam } = useContext(ModelContext);

  type Config = {
    tButtonValues: { value: string; display: string; tooltipTitle?: string; }[];
    selectValue: string | undefined;
    UpdateFunc: (newValue: string) => void;
  }
  type ConfigMap = { [key: string]: Config; }

  const configMap: ConfigMap = {
    inputData: {
      tButtonValues: [
        { value: INPUT_DATA.titanic, display: "Titanic<br/>Passengers" },
        { value: INPUT_DATA.lego, display: "Lego Prices" },
        { value: INPUT_DATA.house, display: "House Prices" },
      ],
      selectValue: props.preSelectDataUS?.preSelectData,
      UpdateFunc: (newValue) => props.preSelectDataUS && props.preSelectDataUS.SetPreSelectData(newValue as INPUT_DATA),
    },
    model: {
      tButtonValues: [
        { value: MODEL.nn, display: "Neural network<br/>(Deep learning)",
          tooltipTitle: "Model inspired by neurons; can handle regression and classification. Layers and activation functions are applied in sequence. Multiple layers are often called deep learning. This system supports up to 5 layers." },
        { value: MODEL.rf, display: "Random forest",
          tooltipTitle: "Model using decision trees to classify data. Handles regression and classification. Combines many trees to improve accuracy." },
        { value: MODEL.svm, display: "SVM<br/>(Support vector machine)",
          tooltipTitle: "Finds boundaries to separate classes; strong at classification. Relatively robust to outliers and noise." },
        { value: MODEL.knn, display: "k-NN<br/>(k-Nearest neighbors)",
          tooltipTitle: "Classifies by similarity (nearby points). Good for classification, simple problems, and small datasets." },
      ],
      selectValue: model,
      UpdateFunc: (newValue) => SetModelVal(newValue as MODEL),
    },
    layer: {
      tButtonValues: [
        { value: LAYER.fully, display: "Fully connected",
          tooltipTitle: "Basic layer: each node applies weights and bias to inputs or previous layer output." },
        { value: LAYER.batch, display: "Batch normalization",
          tooltipTitle: "Normalizes by mean and variance to stabilize training." },
        { value: LAYER.dropout, display: "Dropout",
          tooltipTitle: "Randomly disables nodes to reduce overfitting." },
      ],
      selectValue: nnDetails[nnDetailIdx].layer,
      UpdateFunc: (newValue) => UpdateNnDetail(newValue),
    },
    af: {
      tButtonValues: [
        { value: AF.relu, display: "ReLU",
          tooltipTitle: "Common activation: positive values pass through, negative become 0." },
        { value: AF.tanh, display: "tanh",
          tooltipTitle: "S-shaped output in [-1, 1]; centers values for efficient learning." },
        { value: AF.none, display: "None",
          tooltipTitle: "Pass-through: output equals layer output." },
      ],
      selectValue: nnDetails[nnDetailIdx].af,
      UpdateFunc: (newValue) => UpdateNnDetail(newValue),
    },
    optimizer: {
      tButtonValues: [
        { value: OPTIMIZER.sgd, display: "SGD",
          tooltipTitle: "Basic method: update parameters using gradient from randomly sampled data." },
        { value: OPTIMIZER.momentum, display: "Momentum",
          tooltipTitle: "SGD with inertia; often converges faster." },
        { value: OPTIMIZER.rmsprop, display: "RMSprop",
          tooltipTitle: "Scales update size over time; uses moving average to avoid monotonic decay." },
        { value: OPTIMIZER.adam, display: "Adam",
          tooltipTitle: "Combines ideas from momentum and RMSprop." },
      ],
      selectValue: optimizer,
      UpdateFunc: (newValue) => SetOptimizer(newValue as OPTIMIZER),
    },
    maxFeatures: {
      tButtonValues: [
        { value: MAX_FEATURES.sqrt, display: "sqrt(n)" },
        { value: MAX_FEATURES.log2, display: "log2(n)" },
        { value: MAX_FEATURES.none, display: "All" },
      ],
      selectValue: rfHparam.maxFeatures,
      UpdateFunc: (newValue) => SetRfHparam({ ...rfHparam, maxFeatures: newValue as MAX_FEATURES }),
    },
    kernel: {
      tButtonValues: [
        { value: KERNEL.rbf, display: "RBF<br/>(Radial basis)" },
        { value: KERNEL.linear, display: "Linear" },
        { value: KERNEL.poly, display: "Polynomial" },
        { value: KERNEL.sigmoid, display: "Sigmoid" },
      ],
      selectValue: svmHparam.kernel,
      UpdateFunc: (newValue) => SetSvmHparam({ ...svmHparam, kernel: newValue as KERNEL }),
    },
    weights: {
      tButtonValues: [
        { value: WEIGHTS.uniform, display: "Uniform",
          tooltipTitle: "Equal weight for all neighbors." },
        { value: WEIGHTS.distance, display: "Distance",
          tooltipTitle: "Weight by inverse distance; closer points matter more." },
      ],
      selectValue: knnHparam.weights,
      UpdateFunc: (newValue) => SetKnnHparam({ ...knnHparam, weights: newValue as WEIGHTS }),
    },
    algorithm: {
      tButtonValues: [
        { value: ALGORITHM.auto, display: "Auto",
          tooltipTitle: "Automatically choose algorithm." },
        { value: ALGORITHM.ball_tree, display: "Ball tree",
          tooltipTitle: "Partitions space into balls; good when rows and columns are large." },
        { value: ALGORITHM.kd_tree, display: "KD tree",
          tooltipTitle: "Splits along axes; good when many rows, few columns." },
        { value: ALGORITHM.brute, display: "Brute force",
          tooltipTitle: "Computes all pairwise distances; good when few rows, many columns." },
      ],
      selectValue: knnHparam.algorithm,
      UpdateFunc: (newValue) => SetKnnHparam({ ...knnHparam, algorithm: newValue as ALGORITHM }),
    },
    metric: {
      tButtonValues: [
        { value: METRIC.euclidean, display: "Euclidean",
          tooltipTitle: "Straight-line distance in multi-dimensional space." },
        { value: METRIC.manhattan, display: "Manhattan",
          tooltipTitle: "Sum of absolute differences along each dimension." },
        { value: METRIC.chebyshev, display: "Chebyshev",
          tooltipTitle: "Maximum difference along any dimension." },
      ],
      selectValue: knnHparam.metric,
      UpdateFunc: (newValue) => SetKnnHparam({ ...knnHparam, metric: newValue as METRIC }),
    },
  };
  const config = configMap[props.configKey];
  if (!config) {
    if (import.meta.env.DEV) {
      console.error(`Invalid configKey: ${props.configKey}`);
    }
    return null;
  }
  const { tButtonValues, selectValue = "", UpdateFunc } = config;

  const UpdateNnDetail = (newValue: string) => {
    const newNnDetail = [...nnDetails];
    if (props.configKey === CONFIG_KEY.layer) {
      let paramDef = 0;
      if (newValue === CONFIG_KEY.fully) {
        paramDef = SIV_fully.defValue;
      } else if (newValue === CONFIG_KEY.dropout) {
        paramDef = SIV_dropout.defValue;
      }

      newNnDetail[nnDetailIdx] = {
        ...newNnDetail[nnDetailIdx], layer: newValue as LAYER, param: paramDef,
      };
    } else {
      newNnDetail[nnDetailIdx] = {
        ...newNnDetail[nnDetailIdx], af: newValue as AF,
      };
    }
    SetNnDetail(newNnDetail);
  };

  const HandleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string,
  ) => {
    if (newValue !== null) {
      UpdateFunc(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={selectValue}
      exclusive
      onChange={HandleChange}
    >
      { tButtonValues.map((tButtonValue) => (
        <ToggleButton key={tButtonValue.value} value={tButtonValue.value}>
          {(tButtonValue.tooltipTitle) ? (
            <Tooltip title={tButtonValue.tooltipTitle} placement="bottom-start">
              <div className="text-UL" dangerouslySetInnerHTML={{ __html: tButtonValue.display }} style={{ textTransform: "none" }} />
            </Tooltip>
          ) : (
            <div className="text-def" dangerouslySetInnerHTML={{ __html: tButtonValue.display }} style={{ textTransform: "none" }} />
          )}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
