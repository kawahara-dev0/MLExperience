/** Target selector for ML prediction column. */
import { useContext } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GridColDef } from "@mui/x-data-grid";
import { CommonContext } from "../index";

export default function SelectTarget(props: {
  inputGridCol: GridColDef[];
  preTarget: string;
  SetPreTarget: (value: string) => void;
}) {
  const { selectData } = useContext(CommonContext);
  const HandleChange = (event: SelectChangeEvent) => {
    props.SetPreTarget(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Target</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.preTarget}
          label="Target"
          onChange={HandleChange}
        >
          { props.inputGridCol.slice(1).map((column: GridColDef) => {
            let excludeFields: string[];
            if (selectData === "titanic") {
              excludeFields = ["PassengerId", "Name", "Ticket", "Cabin"];
            } else if (selectData === "lego") {
              excludeFields = ["SetId", "Name", "Theme", "Subtheme"];
            } else {
              excludeFields = ["HouseId"];
            }
            if (excludeFields.includes(column.field)) {
              return null;
            }
            return <MenuItem key={column.field} value={column.field}>{column.headerName}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
