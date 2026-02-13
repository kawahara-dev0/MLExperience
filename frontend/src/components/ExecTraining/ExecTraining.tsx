/** Training execution and result display. */
import React, { useState, useEffect, useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { CommonContext, TargetValues, FetchButton, LostLineChart, FETCH_REQ, PROBLEM, tooltipReg, tooltipClass } from "../index";

export default function ExecTraining() {
  const { waitFetch, fetchError, problem } = useContext(CommonContext);
  const [targetValues, SetTargetValues] = useState<TargetValues>({ yPred: [], yTest: [] });
  const [valLosses, SetValLosses] = useState<number[]>([]);
  const [valMetrics, SetValMetrics] = useState<number[]>([]);
  const [testMetrics, SetTestMetrics] = useState<number[]>([]);
  useEffect(() => {
    if (waitFetch === FETCH_REQ.Training) {
      SetTargetValues({ yPred: [], yTest: [] });
      SetValLosses([]);
      SetValMetrics([]);
      SetTestMetrics([]);
    }
  }, [waitFetch]);

  const tooltipTrain = "Same as input data; split into training and validation for training.";
  const tooltipTest = "Data used for prediction with the trained model (held out from training).";
  const tooltipLost = "How far predictions are from actual values; lower is better. Regression: RMSE; classification: cross-entropy.";
  const tooltipAccuracy = "Fraction of correct predictions (correct / total).";
  const tooltipPrecision = "Of predicted positives, fraction that are actually positive.";
  const tooltipRecall = "Of actual positives, fraction that were predicted positive.";
  const tooltipF1 = "Harmonic mean of precision and recall.";

  return (<>
    <h1>Training</h1>

    <div className="frame">
      <div className="grid-def" style={{ columnGap: 30 }}>
        <FetchButton req={FETCH_REQ.Training} fetchTraining={{ SetTargetValues, SetValLosses, SetValMetrics, SetTestMetrics }} />
        <div className="grid-def">
          <div className="text-def">Problem:&nbsp;</div>
          {(problem[0] === PROBLEM.regression) && (
            <Tooltip title={tooltipReg} placement="bottom-start">
              <div className="text-UL">Regression</div>
            </Tooltip>
          )}
          {(problem[0] === PROBLEM.classification) && (
            <Tooltip title={tooltipClass} placement="bottom-start">
              <div className="text-UL">Classification</div>
            </Tooltip>
          )}
        </div>

        {(fetchError === FETCH_REQ.Training) && (
          <div className="text-def" style={{ color: "red" }}>
            Communication error. Please wait and try again.<br />
            If it persists, the server may be overloaded; try adjusting the model.
          </div>
        )}
        {(fetchError === `${FETCH_REQ.Training} ValueError`) && (
          <div className="text-def" style={{ color: "red" }}>Training failed. Check model settings.</div>
        )}
      </div>

      {(testMetrics.length <= 0) && (
        <div style={{ width: 1000, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {(waitFetch === FETCH_REQ.Training) && (<CircularProgress />)}
        </div>
      )}

      <div className="grid-def margin-cont">
        <div>{(valLosses.length > 0) && (<LostLineChart valLosses={valLosses} />)}</div>
        <div>
          {(valLosses.length > 0) && (<>
            <div className="grid-def">
              <Tooltip title={tooltipTrain} placement="bottom-start">
                <div className="text-UL">Validation</div>
              </Tooltip>
              <div className="text-def">&nbsp;best score</div>
            </div>
            <div className="grid-def margin-sentence">
              <Tooltip title={tooltipLost} placement="bottom-start">
                <div className="text-UL">Loss</div>
              </Tooltip>
              <div className="text-def">: {Math.min(...valLosses)}</div>
            </div>
          </>)}

          {(valMetrics.length > 0) && (
            <div className="grid-metrics margin-sentence">
              <Tooltip title={tooltipAccuracy} placement="bottom-start">
                <div className="text-UL">Accuracy</div>
              </Tooltip>
              <div className="text-def">: {valMetrics[0]}%</div>
              <Tooltip title={tooltipPrecision} placement="bottom-start" style={{ marginLeft: 30 }}>
                <div className="text-UL">Precision</div>
              </Tooltip>
              <div className="text-def">: {valMetrics[1]}%</div>
              <Tooltip title={tooltipRecall} placement="bottom-start">
                <div className="text-UL">Recall</div>
              </Tooltip>
              <div className="text-def">: {valMetrics[2]}%</div>
              <Tooltip title={tooltipF1} placement="bottom-start" style={{ marginLeft: 30 }}>
                <div className="text-UL">F1</div>
              </Tooltip>
              <div className="text-def">: {valMetrics[3]}%</div>
            </div>
          )}

          {(valLosses.length > 0) && (<div className="margin-section" />)}

          {(testMetrics.length > 0) && (<>
            <div className="grid-def">
              <Tooltip title={tooltipTest} placement="bottom-start">
                <div className="text-UL">Test</div>
              </Tooltip>
              <div className="text-def">&nbsp;score</div>
            </div>
            <div className="grid-def margin-sentence">
              <Tooltip title={tooltipLost} placement="bottom-start">
                <div className="text-UL">Loss</div>
              </Tooltip>
              <div className="text-def">: {testMetrics[0]}</div>
            </div>
          </>)}

          {(testMetrics.length > 1) && (
            <div className="grid-metrics margin-sentence">
              <Tooltip title={tooltipAccuracy} placement="bottom-start">
                <div className="text-UL">Accuracy</div>
              </Tooltip>
              <div className="text-def">: {testMetrics[1]}%</div>
              <Tooltip title={tooltipPrecision} placement="bottom-start" style={{ marginLeft: 30 }}>
                <div className="text-UL">Precision</div>
              </Tooltip>
              <div className="text-def">: {testMetrics[2]}%</div>
              <Tooltip title={tooltipRecall} placement="bottom-start">
                <div className="text-UL">Recall</div>
              </Tooltip>
              <div className="text-def">: {testMetrics[3]}%</div>
              <Tooltip title={tooltipF1} placement="bottom-start" style={{ marginLeft: 30 }}>
                <div className="text-UL">F1</div>
              </Tooltip>
              <div className="text-def">: {testMetrics[4]}%</div>
            </div>
          )}

        </div>
      </div>

      {(testMetrics.length > 0) && (<>
        <div className="grid-def margin-section">
          <Tooltip title={tooltipTest} placement="bottom-start">
            <div className="text-UL">Test</div>
          </Tooltip>
          <div className="text-def">&nbsp;details</div>
        </div>
        <div className="grid-tValues margin-sentence">
          <div className="text-def" style={{ width: 70 }}>Predicted: </div>
          <div className="text-def">Actual: </div>
          {targetValues.yPred.map((yPred, index) => (
            <React.Fragment key={index}>
              <div className="text-def">{yPred}</div>
              <div className="text-def">{targetValues.yTest[index]}</div>
            </React.Fragment>
          ))}
        </div>
      </>)}

    </div>
  </>);
}
