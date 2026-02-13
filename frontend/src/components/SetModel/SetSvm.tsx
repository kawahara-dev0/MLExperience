/** Support vector machine model configuration. */
import { useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import { ModelContext, CommonTButton, CommonSInput, CommonCheckBox, CONFIG_KEY, KERNEL } from "../index";

export default function SetSvm() {
  const { svmHparam } = useContext(ModelContext);

  const tooltipKernel = "Function used to separate classes more effectively.";
  const tooltipC = "Regularization. Higher values try to classify perfectly but increase overfitting risk.";
  const tooltipGamma = "Kernel coefficient. Higher values allow more complex boundaries but increase overfitting risk.";

  return (
    <div className="grid-hParam">
      <Tooltip title={tooltipKernel} placement="bottom-start">
        <div className="text-hParam">Kernel</div>
      </Tooltip>
      <CommonTButton configKey={CONFIG_KEY.kernel} />

      <Tooltip title={tooltipC} placement="bottom-start">
        <div className="text-hParam" style={{ marginLeft: 30 }}>C</div>
      </Tooltip>
      <CommonSInput configKey={CONFIG_KEY.c} />

      {(svmHparam.kernel !== KERNEL.linear) && (<>
        <Tooltip title={tooltipGamma} placement="bottom-start">
          <div className="text-hParam">gamma</div>
        </Tooltip>
        <div>
          <CommonCheckBox configKey={CONFIG_KEY.gamma} />
          <CommonSInput configKey={CONFIG_KEY.gamma} />
        </div>
      </>)}
    </div>
  );
}
