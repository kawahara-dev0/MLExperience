/** k-Nearest neighbors model configuration. */
import Tooltip from "@mui/material/Tooltip";
import { CommonSInput, CommonTButton, CONFIG_KEY } from "../index";

export default function SetKnn() {
  const tooltipNNeighbors = "Number of neighbors to use. Fewer neighbors allow more complex patterns but increase overfitting risk.";
  const tooltipWeights = "How to weight neighbor contributions.";
  const tooltipAlgorithm = "Algorithm used to find nearest neighbors.";
  const tooltipMetric = "Distance measure between points; used to decide which points are nearest.";

  return (
    <div className="grid-hParam">
      <Tooltip title={tooltipNNeighbors} placement="bottom-start">
        <div className="text-hParam">n_neighbors</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.nNeighbors} />

      <Tooltip title={tooltipWeights} placement="bottom-start">
        <div className="text-hParam" style={{ marginLeft: 30 }}>weights</div>
      </Tooltip>
      <CommonTButton configKey={CONFIG_KEY.weights} />

      <Tooltip title={tooltipAlgorithm} placement="bottom-start">
        <div className="text-hParam">algorithm</div>
      </Tooltip>
      <CommonTButton configKey={CONFIG_KEY.algorithm} />

      <Tooltip title={tooltipMetric} placement="bottom-start">
        <div className="text-hParam" style={{ marginLeft: 30 }}>metric</div>
      </Tooltip>
      <CommonTButton configKey={CONFIG_KEY.metric} />
    </div>
  );
}
