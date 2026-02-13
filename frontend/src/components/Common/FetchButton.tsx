/** Shared fetch button (uses useApi and useFetchHandlers). */
import { useState, useContext, useCallback } from "react";
import Button from "@mui/material/Button";
import { CommonContext, ModelContext, OptimizeDialog, FETCH_REQ, MODEL } from "../index";
import type { FetchImportProps, FetchPreprocProps, FetchTrainingProps } from "../index";
import { useApi } from "../../hooks/useApi";
import { useFetchHandlers } from "../../hooks/useFetchHandlers";

export default function FetchButton(props: {
  req: string;
  fetchImport?: FetchImportProps;
  fetchPreproc?: FetchPreprocProps;
  fetchTraining?: FetchTrainingProps;
}) {
  const { selectData, target, SetSelectData, SetTarget, waitFetch, SetWaitFetch, SetFetchError } =
    useContext(CommonContext);
  const { model, nnDetails, optimizer, nnHparam, rfHparam, svmHparam, knnHparam } = useContext(ModelContext);

  const [optimizeDialog, SetOptimizeDialog] = useState(false);

  const { fetchApi, loading, error } = useApi();
  const { handleImportResponse, handlePreprocResponse, handleOptimizeResponse, handleTrainingResponse } =
    useFetchHandlers();

  const buttonTextMap: Record<string, string> = {
    [FETCH_REQ.Import]: "Import",
    [FETCH_REQ.Preproc]: "Preprocess",
    [FETCH_REQ.Optimize]: "Auto config",
    [FETCH_REQ.Training]: "Train",
  };

  const getRequestArgs = useCallback(
    (targetValue: string): (string | number | boolean)[] | undefined => {
      if (props.req === FETCH_REQ.Preproc) {
        return [targetValue];
      }
      if (props.req === FETCH_REQ.Optimize) {
        return [targetValue, model];
      }
      if (props.req === FETCH_REQ.Training && props.fetchTraining) {
        if (model === MODEL.nn) {
          const nnDetailsValues = Object.values(nnDetails).flatMap((detail) => [
            detail.last,
            detail.layer,
            detail.param,
            detail.af,
          ]);
          const hParamValues = Object.values(nnHparam);
          return [targetValue, model, ...nnDetailsValues, optimizer, ...hParamValues];
        }
        if (model === MODEL.rf) {
          return [targetValue, model, ...Object.values(rfHparam)];
        }
        if (model === MODEL.svm) {
          return [targetValue, model, ...Object.values(svmHparam)];
        }
        return [targetValue, model, ...Object.values(knnHparam)];
      }
      return undefined;
    },
    [props.req, props.fetchTraining, model, nnDetails, optimizer, nnHparam, rfHparam, svmHparam, knnHparam]
  );

  const handleClick = useCallback(async () => {
    if (props.req === FETCH_REQ.Optimize && !optimizeDialog) {
      SetOptimizeDialog(true);
      return;
    }
    const requestSelectData = 
      props.req === FETCH_REQ.Import && props.fetchImport
        ? props.fetchImport.preSelectData
        : selectData;
    
    const requestTarget =
      props.req === FETCH_REQ.Preproc && props.fetchPreproc
        ? props.fetchPreproc.preTarget
        : target;
    if (props.req === FETCH_REQ.Import && props.fetchImport) {
      SetSelectData(props.fetchImport.preSelectData);
    }
    if (props.req === FETCH_REQ.Preproc && props.fetchPreproc) {
      SetTarget(props.fetchPreproc.preTarget);
    }
    if (props.req === FETCH_REQ.Optimize) {
      SetOptimizeDialog(false);
    }
    SetWaitFetch(props.req);
    SetFetchError("");

    const requestData = {
      req: props.req,
      selectData: requestSelectData,
      arg: getRequestArgs(requestTarget),
    };

    const result = await fetchApi(requestData);

    if (result) {
      if (props.req === FETCH_REQ.Import) {
        handleImportResponse(result as { arg: (string | number)[][] }, props.fetchImport);
      } else if (props.req === FETCH_REQ.Preproc) {
        handlePreprocResponse(
          result as { arg: [string[], (string | number)[][], string[], [(string | number), number]] },
          props.fetchPreproc
        );
      } else if (props.req === FETCH_REQ.Optimize) {
        handleOptimizeResponse(result as { arg: Record<string, unknown> });
      } else if (props.req === FETCH_REQ.Training) {
        handleTrainingResponse(
          result as {
            arg: [number[], number[], number[], [number[], number[]]] | [number[], [number[], number[]]];
          },
          props.fetchTraining
        );
      }
    } else if (error) {
      SetFetchError(props.req);
    }

    SetWaitFetch("");
  }, [
    props,
    selectData,
    target,
    optimizeDialog,
    error,
    getRequestArgs,
    fetchApi,
    handleOptimizeResponse,
    handleTrainingResponse,
  ]);

  const disabled = loading || waitFetch !== "" || (import.meta.env.PROD && props.fetchTraining && model === MODEL.nn);

  return (
    <>
      <OptimizeDialog optimizeDialog={optimizeDialog} SetOptimizeDialog={SetOptimizeDialog} FetchButtonClick={handleClick} />
      <Button variant="contained" onClick={handleClick} disabled={disabled} style={{ minWidth: 100 }}>
        <div className="text-def">{buttonTextMap[props.req] || "Run"}</div>
      </Button>
    </>
  );
}
