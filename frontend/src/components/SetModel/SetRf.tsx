/** Random forest model configuration. */
import Tooltip from "@mui/material/Tooltip";
import { CommonSInput, CommonTButton, CommonCheckBox, CONFIG_KEY } from "../index";

export default function SetRf() {
  const tooltipNEstimators = "Number of trees. More trees improve accuracy but increase time and memory.";
  const tooltipMaxFeatures = "Max features per tree. More allows complex patterns but increases overfitting risk.";
  const tooltipMaxDepth = "Max tree depth. Deeper trees learn more complex patterns but risk overfitting.";
  const tooltipMinSamples = "Min samples to split a node. Lower values allow more splits and complex patterns but risk overfitting.";

  return (
    <div className="grid-hParam">
      <Tooltip title={tooltipNEstimators} placement="bottom-start">
        <div className="text-hParam">n_estimators</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.nEstimators} />

      <Tooltip title={tooltipMaxFeatures} placement="bottom-start">
        <div className="text-hParam" style={{ marginLeft: 30 }}>max_features</div>
      </Tooltip>
      <CommonTButton configKey={CONFIG_KEY.maxFeatures} />

      <Tooltip title={tooltipMaxDepth} placement="bottom-start">
        <div className="text-hParam">max_depth</div>
      </Tooltip>
      <div>
        <CommonCheckBox configKey={CONFIG_KEY.maxDepth} />
        <CommonSInput configKey={CONFIG_KEY.maxDepth} />
      </div>

      <Tooltip title={tooltipMinSamples} placement="bottom-start">
        <div className="text-hParam" style={{ marginLeft: 30 }}>min_samples_split</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.minSamplesSplit} />
    </div>
  );
}
