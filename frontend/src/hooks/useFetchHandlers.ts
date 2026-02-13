/** Custom hook for fetch response handlers. */
import { useContext, useCallback } from "react";
import { CommonContext, ModelContext } from "../components/index";
import type {
  FetchImportProps,
  FetchPreprocProps,
  FetchTrainingProps,
  NnDetail,
  RfHparam,
  SvmHparam,
  KnnHparam,
} from "../types/models";
import { MODEL, LAYER, AF, MAX_FEATURES } from "../types/enums";

export function useFetchHandlers() {
  const { SetProblem } = useContext(CommonContext);
  const {
    model,
    nnDetails,
    SetNnDetail,
    nnHparam,
    SetNnHparam,
    optimizer,
    SetOptimizer,
    rfHparam,
    SetRfHparam,
    svmHparam,
    SetSvmHparam,
    knnHparam,
    SetKnnHparam,
  } = useContext(ModelContext);

  // Import response handling
  const handleImportResponse = useCallback((resData: { arg: (string | number)[][] }, props?: FetchImportProps) => {
    props?.SetInputDataVal(resData.arg);
  }, []);

  const handlePreprocResponse = useCallback((
    resData: { arg: [string[], (string | number)[][], string[], [(string | number), number]] },
    props?: FetchPreprocProps
  ) => {
    props?.SetPreprocCols(resData.arg[0]);
    props?.SetPreprocData(resData.arg[1]);
    props?.SetPreprocCont(resData.arg[2]);
    SetProblem(resData.arg[3]);

    const element = document.querySelector("#Preproc");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleOptimizeResponse = useCallback((resData: { arg: Record<string, unknown> }) => {
    if (model === "nn") {
      const newNnDetails: NnDetail[] = [];
      for (let idx = 1; idx <= 5; idx += 1) {
        let param = resData.arg[`param${idx}`] as number;
        const layer = resData.arg[`layer${idx}`] as LAYER;

        if (layer === "dropout") {
          param /= 100;
        }

        newNnDetails.push({
          last: idx >= (resData.arg.last as number),
          layer,
          param,
          af: resData.arg[`af${idx}`] as AF,
        });
      }
      SetNnDetail(newNnDetails);
      SetOptimizer(resData.arg.optimizer as typeof optimizer);
      SetNnHparam({
        ...nnHparam,
        lr: resData.arg.lr as number,
        miniBatch: resData.arg.miniBatch as number,
      });
    }
    else if (model === "rf") {
      const newRfHparam: RfHparam = {
        nEstimators: resData.arg.n_estimators as number,
        maxFeatures: (resData.arg.max_features as MAX_FEATURES) || "none",
        maxDepth: (resData.arg.max_depth as number) || 0,
        minSamplesSplit: resData.arg.min_samples_split as number,
      };
      SetRfHparam(newRfHparam);
    }
    else if (model === "svm") {
      const newSvmHparam: SvmHparam = {
        kernel: resData.arg.kernel as SvmHparam["kernel"],
        c: resData.arg.c as number,
        gamma: resData.arg.gamma !== "scale" ? (resData.arg.gamma as number) : 0,
      };
      SetSvmHparam(newSvmHparam);
    }
    else {
      const newKnnHparam: KnnHparam = {
        nNeighbors: resData.arg.n_neighbors as number,
        weights: resData.arg.weights as KnnHparam["weights"],
        algorithm: resData.arg.algorithm as KnnHparam["algorithm"],
        metric: resData.arg.metric as KnnHparam["metric"],
      };
      SetKnnHparam(newKnnHparam);
    }
  }, [model, nnHparam, optimizer]);

  const handleTrainingResponse = useCallback((
    resData: { arg: [number[], number[], number[], [number[], number[]]] | [number[], [number[], number[]]] },
    props?: FetchTrainingProps
  ) => {
    if (model === "nn" && resData.arg.length === 4) {
      const [valLosses, valMetrics, testMetrics, targetValues] = resData.arg as [
        number[],
        number[],
        number[],
        [number[], number[]]
      ];
      props?.SetValLosses(valLosses);
      props?.SetValMetrics(valMetrics);
      props?.SetTestMetrics(testMetrics);
      props?.SetTargetValues({ yPred: targetValues[0], yTest: targetValues[1] });
    }
    else if (resData.arg.length === 2) {
      const [testMetrics, targetValues] = resData.arg as [number[], [number[], number[]]];
      props?.SetTestMetrics(testMetrics);
      props?.SetTargetValues({ yPred: targetValues[0], yTest: targetValues[1] });
    }
  }, [model]);

  const getTrainingArgs = (): (string | number | boolean)[] => {
    const target = "";
    if (model === "nn") {
      const nnDetailsValues = Object.values(nnDetails).flatMap((detail) => [
        detail.last,
        detail.layer,
        detail.param,
        detail.af,
      ]);
      const hParamValues = Object.values(nnHparam);
      return [target, model, ...nnDetailsValues, optimizer, ...hParamValues];
    }
    if (model === "rf") {
      return [target, model, ...Object.values(rfHparam)];
    }
    if (model === "svm") {
      return [target, model, ...Object.values(svmHparam)];
    }
    return [target, model, ...Object.values(knnHparam)];
  };

  return {
    handleImportResponse,
    handlePreprocResponse,
    handleOptimizeResponse,
    handleTrainingResponse,
    getTrainingArgs,
  };
}
