/** Shared slider input component. */
import { useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { ModelContext, SInputValue, SIV_fully, SIV_dropout, SIV_lr, SIV_miniBatch, SIV_epoch, SIV_nEstimators,
         SIV_maxDepth, SIV_minSamplesSplit, SIV_c, SIV_gamma, SIV_nNeighbors, CONFIG_KEY } from "../index";

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function CommonSInput(props: {
  configKey: string;
  nnDetailIdx?: number;
}) {
  const { nnDetailIdx = 0 } = props;
  const { nnDetails, SetNnDetail, nnHparam, SetNnHparam,
          rfHparam, SetRfHparam, svmHparam, SetSvmHparam, knnHparam, SetKnnHparam } = useContext(ModelContext);

  type Config = {
    sInputValue: SInputValue;
    value: number;
    UpdateFunc: (newValue: number) => void;
    sxWidth?: number;
  }
  type ConfigMap = { [key: string]: Config; }

  const config: ConfigMap = {
    fully: {
      sInputValue: SIV_fully, value: nnDetails[nnDetailIdx].param,
      UpdateFunc: (newValue) => UpdateNnDetail(newValue),
    },
    dropout: {
      sInputValue: SIV_dropout, value: nnDetails[nnDetailIdx].param,
      UpdateFunc: (newValue) => UpdateNnDetail(newValue),
    },
    lr: {
      sInputValue: SIV_lr, value: nnHparam.lr,
      UpdateFunc: (newValue) => SetNnHparam({ ...nnHparam, lr: newValue }),
      sxWidth: 60,
    },
    miniBatch: {
      sInputValue: SIV_miniBatch, value: nnHparam.miniBatch,
      UpdateFunc: (newValue) => SetNnHparam({ ...nnHparam, miniBatch: newValue }),
    },
    epoch: {
      sInputValue: SIV_epoch, value: nnHparam.epoch,
      UpdateFunc: (newValue) => SetNnHparam({ ...nnHparam, epoch: newValue }),
    },
    nEstimators: {
      sInputValue: SIV_nEstimators, value: rfHparam.nEstimators,
      UpdateFunc: (newValue) => SetRfHparam({ ...rfHparam, nEstimators: newValue }),
      sxWidth: 60,
    },
    maxDepth: {
      sInputValue: SIV_maxDepth, value: rfHparam.maxDepth,
      UpdateFunc: (newValue) => SetRfHparam({ ...rfHparam, maxDepth: newValue }),
    },
    minSamplesSplit: {
      sInputValue: SIV_minSamplesSplit, value: rfHparam.minSamplesSplit,
      UpdateFunc: (newValue) => SetRfHparam({ ...rfHparam, minSamplesSplit: newValue }),
    },
    c: {
      sInputValue: SIV_c, value: svmHparam.c,
      UpdateFunc: (newValue) => SetSvmHparam({ ...svmHparam, c: newValue }),
    },
    gamma: {
      sInputValue: SIV_gamma, value: svmHparam.gamma,
      UpdateFunc: (newValue) => SetSvmHparam({ ...svmHparam, gamma: newValue }),
      sxWidth: 60,
    },
    nNeighbors: {
      sInputValue: SIV_nNeighbors, value: knnHparam.nNeighbors,
      UpdateFunc: (newValue) => SetKnnHparam({ ...knnHparam, nNeighbors: newValue }),
    },
  };
  const configItem = config[props.configKey];
  if (!configItem) {
    if (import.meta.env.DEV) {
      console.error(`Invalid configKey: ${props.configKey}`);
    }
    return null;
  }
  const { sInputValue, value, UpdateFunc, sxWidth = 50 } = configItem;

  const UpdateNnDetail = (newValue: number) => {
    const newNnDetail = [...nnDetails];
    newNnDetail[nnDetailIdx].param = newValue;
    SetNnDetail(newNnDetail);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    UpdateFunc(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue;
    if (event.target.value === "") {
      newValue = sInputValue.defValue;
    } else {
      newValue = Number(event.target.value);
    }
    if (sInputValue.minValue >= 1) {
      newValue = Math.round(newValue);
    }
    UpdateFunc(newValue);
  };

  const handleBlur = () => {
    if (value < sInputValue.minValue) {
      UpdateFunc(sInputValue.minValue);
    } else if (value > sInputValue.maxValue) {
      UpdateFunc(sInputValue.maxValue);
    }
  };

  const disabled = ((props.configKey === CONFIG_KEY.maxDepth) && (rfHparam.maxDepth === 0))
                   || ((props.configKey === CONFIG_KEY.gamma) && (svmHparam.gamma === 0));

  return (
    <Box sx={{ width: 200 + sxWidth }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : sInputValue.defValue}
            onChange={handleSliderChange}
            min={sInputValue.minValue}
            max={sInputValue.maxValue}
            step={sInputValue.minValue}
            aria-labelledby="input-slider"
            disabled={disabled}
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            sx={{ width: sxWidth }}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              min: sInputValue.minValue, max: sInputValue.maxValue, step: (sInputValue.maxValue / 10),
              type: "number", "aria-labelledby": "input-slider",
            }}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
