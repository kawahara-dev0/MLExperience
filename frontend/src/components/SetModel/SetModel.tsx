/** Model setup: select ML model and configure parameters. */
import { useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { CommonContext, ModelContext, CommonTButton, FetchButton, SetNn, SetRf, SetSvm, SetKnn,
         CONFIG_KEY, FETCH_REQ, MODEL, tooltipReg, tooltipClass } from "../index";

export default function SetModel() {
  const { waitFetch, fetchError } = useContext(CommonContext);
  const { model } = useContext(ModelContext);

  const tooltipModel = "Mechanism that analyzes input and produces output. Tuning methods and parameters improves prediction.";
  const tooltipNode = "Basic processing unit in machine learning; each node performs analysis. A layer typically contains multiple nodes.";
  const tooltipOF = "Model is tuned too much to training data and performs worse on new, unseen data.";

  return (<>
    <h1>Model config</h1>

    <div className="frame">
      <div className="grid-def">
        <div className="text-def">Configure the&nbsp;</div>
        <Tooltip title={tooltipModel} placement="bottom-start">
          <div className="text-UL">model</div>
        </Tooltip>        
        <div className="text-def">&nbsp;settings below.</div>
      </div>

      <div className="text-def margin-sentence">
        Term descriptions:
      </div>
      <div className="grid-def" style={{ columnGap: 20 }}>
        <Tooltip title={tooltipReg} placement="bottom-start">
          <div className="text-UL">Regression</div>
        </Tooltip>
        <Tooltip title={tooltipClass} placement="bottom-start">
          <div className="text-UL">Classification</div>
        </Tooltip>
        <Tooltip title={tooltipNode} placement="bottom-start">
          <div className="text-UL">Node</div>
        </Tooltip>
        <Tooltip title={tooltipOF} placement="bottom-start">
          <div className="text-UL">Overfitting</div>
        </Tooltip>
      </div>

      <div className="margin-cont">
        <CommonTButton configKey={CONFIG_KEY.model} />
      </div>

      {import.meta.env.DEV && (<>
        <div id="SetDetail" className="separator-line" />

        <div style={{ height: 50, display: "flex", alignItems: "center", columnGap: 30 }}>
          <FetchButton req={FETCH_REQ.Optimize} />
          {(waitFetch === FETCH_REQ.Optimize) && (<CircularProgress style={{ marginLeft: 20 }} />)}
          {(fetchError === FETCH_REQ.Optimize) && (
            <div style={{ color: "red" }}>Server communication error. Please try again later.</div>
          )}
        </div>
      </>)}

      {(model === MODEL.nn) && (<div className="margin-cont"><SetNn /></div>)}
      {(model === MODEL.rf) && (<div className="margin-cont"><SetRf /></div>)}
      {(model === MODEL.svm) && (<div className="margin-cont"><SetSvm /></div>)}
      {(model === MODEL.knn) && (<div className="margin-cont"><SetKnn /></div>)}
    </div>
  </>);
}
