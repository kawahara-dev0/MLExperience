/** Component re-exports and Context definitions. */
import { createContext } from "react";
import {
  INPUT_DATA,
  PROBLEM,
  MODEL,
  LAYER,
  AF,
  OPTIMIZER,
  MAX_FEATURES,
  KERNEL,
  WEIGHTS,
  ALGORITHM,
  METRIC,
  SIV_fully,
  SIV_lr,
  SIV_miniBatch,
  SIV_epoch,
  SIV_nEstimators,
  SIV_maxDepth,
  SIV_minSamplesSplit,
  SIV_c,
  SIV_gamma,
  SIV_nNeighbors,
} from "../types";
import type { NnDetail, NnHparam, RfHparam, SvmHparam, KnnHparam, CommonContextType, ModelContextType } from "../types";

export { default as CommonCheckBox } from "./Common/CommonCheckBox";
export { default as CommonSInput } from "./Common/CommonSInput";
export { default as CommonTButton } from "./Common/CommonTButton";
export { default as FetchButton } from "./Common/FetchButton";
export { default as OptimizeDialog } from "./Common/OptimizeDialog";

export { default as SetInputData } from "./SetInputData/SetInputData";
export { default as DataTable } from "./SetInputData/DataTable";
export { default as SelectTarget } from "./SetInputData/SelectTarget";

export { default as SetModel } from "./SetModel/SetModel";
export { default as SetNn } from "./SetModel/SetNn";
export { default as SetRf } from "./SetModel/SetRf";
export { default as SetSvm } from "./SetModel/SetSvm";
export { default as SetKnn } from "./SetModel/SetKnn";

export { default as ExecTraining } from "./ExecTraining/ExecTraining";
export { default as LostLineChart } from "./ExecTraining/LostLineChart";

export * from "../types";

export const CommonContext = createContext<CommonContextType>({
  selectData: INPUT_DATA.titanic,
  SetSelectData: (_value: INPUT_DATA) => {},
  target: "",
  SetTarget: (_value: string) => {},
  problem: [PROBLEM.regression, 1] as [PROBLEM | number, number],
  SetProblem: (_value: (PROBLEM | number)[]) => {},
  waitFetch: "",
  SetWaitFetch: (_value: string) => {},
  fetchError: "",
  SetFetchError: (_value: string) => {},
});

export const ModelContext = createContext<ModelContextType>({
  model: MODEL.nn,
  SetModelVal: (_value: MODEL) => {},
  nnDetails: [
    { last: false, layer: LAYER.batch, param: 0, af: AF.relu },
    { last: false, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
    { last: true, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
    { last: true, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
    { last: true, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
  ],
  SetNnDetail: (_value: NnDetail[]) => {},
  optimizer: OPTIMIZER.sgd,
  SetOptimizer: (_value: OPTIMIZER) => {},
  nnHparam: { lr: SIV_lr.defValue, miniBatch: SIV_miniBatch.defValue, epoch: SIV_epoch.defValue },
  SetNnHparam: (_value: NnHparam) => {},
  rfHparam: {
    nEstimators: SIV_nEstimators.defValue,
    maxFeatures: MAX_FEATURES.sqrt,
    maxDepth: SIV_maxDepth.defValue,
    minSamplesSplit: SIV_minSamplesSplit.defValue,
  },
  SetRfHparam: (_value: RfHparam) => {},
  svmHparam: { kernel: KERNEL.rbf, c: SIV_c.defValue, gamma: SIV_gamma.defValue },
  SetSvmHparam: (_value: SvmHparam) => {},
  knnHparam: {
    nNeighbors: SIV_nNeighbors.defValue,
    weights: WEIGHTS.uniform,
    algorithm: ALGORITHM.auto,
    metric: METRIC.euclidean,
  },
  SetKnnHparam: (_value: KnnHparam) => {},
});
