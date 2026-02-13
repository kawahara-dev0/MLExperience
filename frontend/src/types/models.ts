/** Model types for business logic. */
import type { INPUT_DATA, PROBLEM, MODEL, LAYER, AF, OPTIMIZER, MAX_FEATURES, KERNEL, WEIGHTS, ALGORITHM, METRIC } from "./enums";

export type NnDetail = {
  last: boolean;
  layer: LAYER;
  param: number;
  af: AF;
};

export type NnHparam = {
  lr: number;
  miniBatch: number;
  epoch: number;
};

export type RfHparam = {
  nEstimators: number;
  maxFeatures: MAX_FEATURES;
  maxDepth: number;
  minSamplesSplit: number;
};

export type SvmHparam = {
  kernel: KERNEL;
  c: number;
  gamma: number;
};

export type KnnHparam = {
  nNeighbors: number;
  weights: WEIGHTS;
  algorithm: ALGORITHM;
  metric: METRIC;
};

export type TargetValues = {
  yPred: number[];
  yTest: number[];
};

export type FetchImportProps = {
  preSelectData: INPUT_DATA;
  SetInputDataVal: (value: (string | number)[][]) => void;
};

export type FetchPreprocProps = {
  preTarget: string;
  SetPreprocCols: (value: string[]) => void;
  SetPreprocData: (value: (string | number)[][]) => void;
  SetPreprocCont: (value: string[]) => void;
};

// Training fetch props
export type FetchTrainingProps = {
  SetTargetValues: (value: TargetValues) => void;
  SetValLosses: (value: number[]) => void;
  SetValMetrics: (value: number[]) => void;
  SetTestMetrics: (value: number[]) => void;
};
