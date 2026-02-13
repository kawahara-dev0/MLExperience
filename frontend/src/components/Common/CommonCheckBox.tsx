/** Shared checkbox component. */
import React, { useContext } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ModelContext } from "../index";

export default function CommonCheckBox(props: {
  configKey: string;
  nnDetailIdx?: number;
}) {
  const { nnDetailIdx = 0 } = props;
  const { nnDetails, SetNnDetail, rfHparam, SetRfHparam, svmHparam, SetSvmHparam } = useContext(ModelContext);

  type Config = {
    checkedCnd: boolean;
    UpdateFunc: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    disabledCnd?: boolean;
  }
  type ConfigMap = { [key: string]: Config; }

  const configMap: ConfigMap = {
    lastLayer: {
      checkedCnd: nnDetails[nnDetailIdx].last,
      UpdateFunc: (newValue) => UpdateLastLayer(newValue),
      disabledCnd: nnDetailIdx === 4,
    },
    maxDepth: {
      checkedCnd: rfHparam.maxDepth === 0,
      UpdateFunc: (newValue) => UpdateMaxDepth(newValue),
      label: "No limit",
    },
    gamma: {
      checkedCnd: svmHparam.gamma === 0,
      UpdateFunc: (newValue) => UpdateGamma(newValue),
      label: "Auto",
    },
  };
  const config = configMap[props.configKey];
  if (!config) {
    if (import.meta.env.DEV) {
      console.error(`Invalid configKey: ${props.configKey}`);
    }
    return null;
  }
  const { checkedCnd, UpdateFunc, disabledCnd, label } = config;

  const UpdateLastLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    const newNnDetails = [...nnDetails];
    newNnDetails[nnDetailIdx].last = newChecked;
    if (newChecked) {
      for (let index = nnDetailIdx + 1; index < newNnDetails.length; index += 1) {
        newNnDetails[index].last = true;
      }
    }
    SetNnDetail(newNnDetails);
  };

  const UpdateMaxDepth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    if (newChecked) {
      SetRfHparam({ ...rfHparam, maxDepth: 0 });
    } else {
      SetRfHparam({ ...rfHparam, maxDepth: 10 });
    }
  };

  const UpdateGamma = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    if (newChecked) {
      SetSvmHparam({ ...svmHparam, gamma: 0 });
    } else {
      SetSvmHparam({ ...svmHparam, gamma: 0.1 });
    }
  };

  return (
    (label !== undefined) ? (
      <FormControlLabel
        control={
          <Checkbox checked={checkedCnd} onChange={UpdateFunc} disabled={disabledCnd} />
        }
        label={label}
      />
    ) : (
      <Checkbox checked={checkedCnd} onChange={UpdateFunc} disabled={disabledCnd} />
    )
  );
}
