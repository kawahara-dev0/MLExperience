/** API types for backend communication. */

export enum FETCH_REQ {
  Import = "Import",
  Preproc = "Preproc",
  Optimize = "Optimize",
  Training = "Training",
}

export interface ApiRequest {
  req: FETCH_REQ;
  selectData: string;
  arg?: (string | number | boolean)[];
}

export interface ApiResponse<T = unknown> {
  res: string;
  arg: T;
}

export type ImportResponse = ApiResponse<(string | number)[][]>;

export interface PreprocResponseArg {
  columns: string[];
  data: (string | number)[][];
  preprocCont: string[];
  problem: [string, number];
}
export type PreprocResponse = ApiResponse<[string[], (string | number)[][], string[], [string, number]]>;

export type OptimizeResponse = ApiResponse<Record<string, string | number>>;

// Training response (NN)
export type TrainingResponseNN = ApiResponse<[
  number[], // valLosses
  number[], // valMetrics
  number[], // testMetrics
  [number[], number[]] // [yPred, yTest]
]>;

// Training response (other models)
export type TrainingResponseOther = ApiResponse<[
  number[], // testMetrics
  [number[], number[]] // [yPred, yTest]
]>;

export interface ErrorResponse {
  res: "error" | string;
  arg: string | unknown;
}
