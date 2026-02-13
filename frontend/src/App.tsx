/** ML Experience System: main app (preprocessing, model config, training). */
import React, { useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SetInputData, SetModel, ExecTraining, NnDetail, NnHparam,
         RfHparam, SvmHparam, KnnHparam, CommonContext, ModelContext,
         INPUT_DATA, PROBLEM, MODEL, LAYER, AF, OPTIMIZER, MAX_FEATURES, KERNEL, WEIGHTS, ALGORITHM, METRIC,
         SIV_fully, SIV_lr, SIV_miniBatch, SIV_epoch, SIV_nEstimators, SIV_maxDepth, SIV_minSamplesSplit,
         SIV_c, SIV_gamma, SIV_nNeighbors } from "./components/index";

export default function App() {
  const [selectData, SetSelectData] = useState(INPUT_DATA.titanic);
  const [target, SetTarget] = useState("");
  const [preprocData, SetPreprocData] = useState<(string | number)[][]>([]);
  useEffect(() => {
    SetPreprocData([]);
  }, [target]);
  const [problem, SetProblem] = useState<(PROBLEM | number)[]>([PROBLEM.regression, 1]);

  const [model, SetModelVal] = useState(MODEL.nn);
  const [nnDetails, SetNnDetail] = useState<NnDetail[]>([
    { last: false, layer: LAYER.batch, param: 0, af: AF.relu },
    { last: false, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
    { last: true, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
    { last: true, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
    { last: true, layer: LAYER.fully, param: SIV_fully.defValue, af: AF.relu },
  ]);
  const [optimizer, SetOptimizer] = useState(OPTIMIZER.sgd);
  const [nnHparam, SetNnHparam] = useState<NnHparam>(
    { lr: SIV_lr.defValue, miniBatch: SIV_miniBatch.defValue, epoch: SIV_epoch.defValue },
  );
  const [rfHparam, SetRfHparam] = useState<RfHparam>(
    { nEstimators: SIV_nEstimators.defValue, maxFeatures: MAX_FEATURES.sqrt,
      maxDepth: SIV_maxDepth.defValue, minSamplesSplit: SIV_minSamplesSplit.defValue },
  );
  const [svmHparam, SetSvmHparam] = useState<SvmHparam>(
    { kernel: KERNEL.rbf, c: SIV_c.defValue, gamma: SIV_gamma.defValue },
  );
  const [knnHparam, SetKnnHparam] = useState<KnnHparam>(
    { nNeighbors: SIV_nNeighbors.defValue, weights: WEIGHTS.uniform, algorithm: ALGORITHM.auto, metric: METRIC.euclidean },
  );
  const [waitFetch, SetWaitFetch] = useState("");
  const [fetchError, SetFetchError] = useState("");

  const commonCtValue = useMemo(() => ({
    selectData, SetSelectData,
    target, SetTarget,
    problem, SetProblem,
    waitFetch, SetWaitFetch,
    fetchError, SetFetchError,
  }), [selectData, target, problem, waitFetch, fetchError]);

  const modelCtValue = useMemo(() => ({
    model, SetModelVal,
    nnDetails, SetNnDetail,
    optimizer, SetOptimizer,
    nnHparam, SetNnHparam,
    rfHparam, SetRfHparam,
    svmHparam, SetSvmHparam,
    knnHparam, SetKnnHparam,
  }), [model, nnDetails, optimizer, nnHparam, rfHparam, svmHparam, knnHparam]);

  const darkTheme = createTheme({ palette: { mode: "dark" } });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="sidebar">
        <div><a className="a-inherit" href="#SetInputData">1. Input data</a></div>
        <div className="margin-list">
          <a className="a-inherit" href="#SetInputData">- Data import</a>
        </div>
        <div className="margin-list">
          <a className="a-inherit" href="#Preproc">- Preprocessing</a>
        </div>
        <div className="margin-cont">
          <a className="a-inherit" href="#SetModel">2. Model config</a>
        </div>
        {import.meta.env.DEV && (<>
          <div className="margin-list">
            <a className="a-inherit" href="#SetModel">- Model selection</a>
          </div>
          <div className="margin-list">
            <a className="a-inherit" href="#SetDetail">- Model details</a>
          </div>
        </>)}
        <div className="margin-cont">
          <a className="a-inherit" href="#ExecTraining">3. Training</a>
        </div>
      </div>

      <div className="main-cont">
        <CommonContext.Provider value={commonCtValue}>
          <section id="SetInputData">
            <SetInputData preprocData={preprocData} SetPreprocData={SetPreprocData} />
          </section>

          {(preprocData.length > 0) && (
            <ModelContext.Provider value={modelCtValue}>
              <section id="SetModel" className="margin-section">
                <SetModel />
              </section>

              <section id="ExecTraining" className="margin-section">
                <ExecTraining />
              </section>
            </ModelContext.Provider>
          )}
        </CommonContext.Provider>
        <div style={{ height: 150 }} />
      </div>
    </ThemeProvider>
  );
}
