/** Neural network model configuration. */
import React, { useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import { CommonContext, ModelContext, CommonCheckBox, CommonTButton, CommonSInput,
         CONFIG_KEY, LAYER, PROBLEM } from "../index";

export default function SetNn() {
  const { problem } = useContext(CommonContext);
  const { nnDetails } = useContext(ModelContext);

  const tooltipLayer = "Processing applied to input or previous layer output.";
  const tooltipAF = "Determines output to the next layer from layer values.";
  const tooltipOpt = "Algorithm that optimizes weights and bias during training to improve prediction.";
  const tooltipLR = "Update parameters by gradient times learning rate. A good rate helps reach optimum.";
  const tooltipBatch = "Split data into mini-batches; train on each. Mini-batch size is samples per batch. A good size improves efficiency and performance.";
  const tooltipEpoch = "One epoch = one full pass over the data. Max epochs = how many such passes. Training may stop earlier if no further improvement.";
  const layers = ["1", "2", "3", "4", "5"];

  return (<>
    {import.meta.env.PROD && (<>
      <div style={{ color: "red" }}>Training is disabled on this server.</div>
    </>)}

    <div className="grid-setNn margin-cont">
      <div className="info" />
      <div className="info text-def" style={{ justifyContent: "center" }}>Last</div>
      <div className="info">
        <Tooltip title={tooltipLayer} placement="bottom-start">
          <div className="text-UL">Layer</div>
        </Tooltip>
      </div>
      <div className="info">
        <Tooltip title={tooltipAF} placement="bottom-start">
          <div className="text-UL">Activation</div>
        </Tooltip>
      </div>

      { layers.map((layer, index) => (
        ((index === 0) || !(nnDetails[index - 1].last)) && (
          <React.Fragment key={index}>
            <div className="item text-def" style={{ width: 50 }}>
              Layer {layer}
            </div>
            <div className="item" style={{ width: 50 }}>
              <CommonCheckBox configKey={CONFIG_KEY.lastLayer} nnDetailIdx={index} />
            </div>
            <div className="item" style={{ width: 400 }}>
              <CommonTButton configKey={CONFIG_KEY.layer} nnDetailIdx={index} />
              {(nnDetails[index].layer !== LAYER.batch) && (
                <div className="grid-def" style={{ columnGap: 20, marginTop: 20 }}>
                  {(nnDetails[index].layer === LAYER.fully) ? (<>Nodes</>) : (<>Dropout rate</>)}
                  <CommonSInput configKey={nnDetails[index].layer} nnDetailIdx={index} />
                </div>
              )}
            </div>
            <div className="item" style={{ width: 200 }}>
              <CommonTButton configKey={CONFIG_KEY.af} nnDetailIdx={index} />
            </div>
          </React.Fragment>
        )
      ))}

      <div className="info text-def">Output</div>
      <div className="info" />
      <div className="info text-def">{problem[0] === PROBLEM.regression ? "Regression" : "Classification"} — nodes: {problem[1]}</div>
      <div className="info" />
    </div>

    <div className="separator-line" />

    <Tooltip title={tooltipOpt} placement="bottom-start">
      <div className="text-UL">Optimizer</div>
    </Tooltip>
    <div className="margin-sentence">
      <CommonTButton configKey={CONFIG_KEY.optimizer} />
    </div>

    <div className="grid-hParam margin-cont">
      <Tooltip title={tooltipLR} placement="bottom-start">
        <div className="text-hParam">Learning rate</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.lr} />

      <div /><div />

      <Tooltip title={tooltipBatch} placement="bottom-start">
        <div className="text-hParam">Mini-batch size</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.miniBatch} />

      <Tooltip title={tooltipEpoch} placement="bottom-start">
        <div className="text-hParam" style={{ marginLeft: 30 }}>Max epochs</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.epoch} />
    </div>
  </>);
}
