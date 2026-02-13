/** Context types for React Context. */
import type { INPUT_DATA, PROBLEM, MODEL, OPTIMIZER } from "./enums";
import type { NnDetail, NnHparam, RfHparam, SvmHparam, KnnHparam } from "./models";

export interface CommonContextType {
  selectData: INPUT_DATA;
  SetSelectData: (value: INPUT_DATA) => void;
  target: string;
  SetTarget: (value: string) => void;
  problem: [PROBLEM | number, number];
  SetProblem: (value: (PROBLEM | number)[]) => void;
  waitFetch: string;
  SetWaitFetch: (value: string) => void;
  fetchError: string;
  SetFetchError: (value: string) => void;
}

export interface ModelContextType {
  model: MODEL;
  SetModelVal: (value: MODEL) => void;
  nnDetails: NnDetail[];
  SetNnDetail: (value: NnDetail[]) => void;
  optimizer: OPTIMIZER;
  SetOptimizer: (value: OPTIMIZER) => void;
  nnHparam: NnHparam;
  SetNnHparam: (value: NnHparam) => void;
  rfHparam: RfHparam;
  SetRfHparam: (value: RfHparam) => void;
  svmHparam: SvmHparam;
  SetSvmHparam: (value: SvmHparam) => void;
  knnHparam: KnnHparam;
  SetKnnHparam: (value: KnnHparam) => void;
}
