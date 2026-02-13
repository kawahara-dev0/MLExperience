/** Constants used across the system. */

export type SInputValue = {
  minValue: number;
  maxValue: number;
  defValue: number;
};

export const SIV_fully: SInputValue = {
  minValue: 1,
  maxValue: 100,
  defValue: 30,
};

export const SIV_dropout: SInputValue = {
  minValue: 0.01,
  maxValue: 0.99,
  defValue: 0.5,
};

export const SIV_lr: SInputValue = {
  minValue: 0.001,
  maxValue: 0.1,
  defValue: 0.01,
};

export const SIV_miniBatch: SInputValue = {
  minValue: 8,
  maxValue: 96,
  defValue: 32,
};

export const SIV_epoch: SInputValue = {
  minValue: 1,
  maxValue: 200,
  defValue: 100,
};

export const SIV_nEstimators: SInputValue = {
  minValue: 10,
  maxValue: 1000,
  defValue: 100,
};

export const SIV_maxDepth: SInputValue = {
  minValue: 3,
  maxValue: 30,
  defValue: 0,
};

export const SIV_minSamplesSplit: SInputValue = {
  minValue: 2,
  maxValue: 10,
  defValue: 2,
};

export const SIV_c: SInputValue = {
  minValue: 0.1,
  maxValue: 100,
  defValue: 1,
};

export const SIV_gamma: SInputValue = {
  minValue: 0.001,
  maxValue: 1,
  defValue: 0,
};

export const SIV_nNeighbors: SInputValue = {
  minValue: 3,
  maxValue: 10,
  defValue: 5,
};

export const tooltipML =
  "Technology that discovers patterns and rules in data by analyzing and learning from it; used for prediction and decision-making.";

export const tooltipReg =
  "Predicting a numeric target from input data (e.g., house price from house features, nutrition from recipe).";

export const tooltipClass =
  "Classifying the target category from input data (e.g., male/female from height and weight, animal type from features).";
