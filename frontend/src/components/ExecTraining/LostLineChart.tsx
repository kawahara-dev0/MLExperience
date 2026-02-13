/** Validation loss line chart. */
import { LineChart } from "@mui/x-charts/LineChart";

export default function LostLineChart(props: { valLosses: number[]; }) {
  let step = 5;
  if (props.valLosses.length > 100) {
    step = 20;
  } else if (props.valLosses.length > 50) {
    step = 10;
  }

  const xAxisData: (number | string)[] = [];
  const selectValLosses: number[] = [];
  for (let xAxis = 0; xAxis <= props.valLosses.length; xAxis += step) {
    if (xAxis === 0) {
      xAxisData.push(1);
      selectValLosses.push(props.valLosses[0]);

    } else {
      xAxisData.push(xAxis);
      selectValLosses.push(props.valLosses[xAxis - 1]);
    }
  }
  if (props.valLosses.length % step !== 0) {
    xAxisData.push(props.valLosses.length);
    selectValLosses.push(props.valLosses[props.valLosses.length - 1]);
  }

  xAxisData[xAxisData.length - 1] = `${xAxisData[xAxisData.length - 1]}\n(epoch)`;

  return (<>
    <div style={{ fontSize: 13, marginLeft: 10, marginBottom: -40 }}>
      (Loss)
    </div>
    <LineChart
      xAxis={[{ scaleType: "point", data: xAxisData }]}
      yAxis={[{ min: 0 }]}
      series={[{ curve: "linear", data: selectValLosses, label: "Validation loss" }]}
      width={600}
      height={500}
    />
  </>);
}
