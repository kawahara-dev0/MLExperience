/** Renders data in a grid. */
import { useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function DataTable(props: {
  gridCol: GridColDef[];
  data: (string | number)[][];
}) {
  const rows = useMemo(() => {
    return props.data.map((dataRow: (string | number)[], index: number) => {
      const row: { [key: string]: string | number } = { id: index };
      props.gridCol.slice(1).forEach((col, colIndex) => {
        row[col.field] = dataRow[colIndex];
      });

      return row;
    });
  }, [props.data, props.gridCol]);

  return (
    <div className="datagrid">
      <DataGrid
        rows={rows}
        columns={props.gridCol}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        checkboxSelection
      />
    </div>
  );
}
