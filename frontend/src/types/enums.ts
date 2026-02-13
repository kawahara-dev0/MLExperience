/** Enums used across the system. */

export enum INPUT_DATA {
  titanic = "titanic",
  lego = "lego",
  house = "house",
}

export enum PROBLEM {
  regression = "regression",
  classification = "classification",
}

export enum MODEL {
  nn = "nn",
  rf = "rf",
  svm = "svm",
  knn = "knn",
}

export enum LAYER {
  fully = "fully",
  batch = "batch",
  dropout = "dropout",
}

export enum AF {
  relu = "relu",
  tanh = "tanh",
  none = "none",
}

export enum OPTIMIZER {
  sgd = "sgd",
  momentum = "momentum",
  rmsprop = "rmsprop",
  adam = "adam",
}

export enum MAX_FEATURES {
  sqrt = "sqrt",
  log2 = "log2",
  none = "none",
}

export enum KERNEL {
  rbf = "rbf",
  linear = "linear",
  poly = "poly",
  sigmoid = "sigmoid",
}

export enum WEIGHTS {
  uniform = "uniform",
  distance = "distance",
}

export enum ALGORITHM {
  auto = "auto",
  ball_tree = "ball_tree",
  kd_tree = "kd_tree",
  brute = "brute",
}

export enum METRIC {
  euclidean = "euclidean",
  manhattan = "manhattan",
  chebyshev = "chebyshev",
}

export enum CONFIG_KEY {
  inputData = "inputData",
  model = "model",
  lastLayer = "lastLayer",
  layer = "layer",
  fully = "fully",
  dropout = "dropout",
  af = "af",
  optimizer = "optimizer",
  lr = "lr",
  miniBatch = "miniBatch",
  epoch = "epoch",
  nEstimators = "nEstimators",
  maxFeatures = "maxFeatures",
  maxDepth = "maxDepth",
  minSamplesSplit = "minSamplesSplit",
  kernel = "kernel",
  c = "c",
  gamma = "gamma",
  nNeighbors = "nNeighbors",
  weights = "weights",
  algorithm = "algorithm",
  metric = "metric",
}
