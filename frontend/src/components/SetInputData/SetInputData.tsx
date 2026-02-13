/** Input data setup: select data and target, run preprocessing. */
import React, { useState, useEffect, useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { GridColDef } from "@mui/x-data-grid";
import { CommonContext, CommonTButton, FetchButton, DataTable, SelectTarget,
         CONFIG_KEY, INPUT_DATA, FETCH_REQ, tooltipML } from "../index";

export default function SetInputData(props: {
  preprocData: (string | number)[][];
  SetPreprocData: (value: (string | number)[][]) => void;
}) {
  const { selectData, waitFetch, fetchError } = useContext(CommonContext);
  const [preSelectData, SetPreSelectData] = useState(INPUT_DATA.titanic);
  const [preTarget, SetPreTarget] = useState("");

  const titanicGridCol: GridColDef[] = [
    { field: "id", headerName: "No.", type: "number", width: 100 },
    { field: "PassengerId", headerName: "Passenger ID", type: "number", width: 150 },
    { field: "Survived", headerName: "Survived", type: "number", width: 100 },
    { field: "Pclass", headerName: "Pclass", type: "number", width: 100 },
    { field: "Name", headerName: "Name", width: 300 },
    { field: "Sex", headerName: "Sex", width: 100 },
    { field: "Age", headerName: "Age", type: "number", width: 100 },
    { field: "SibSp", headerName: "Siblings / Spouses", type: "number", width: 150 },
    { field: "Parch", headerName: "Parch", type: "number", width: 100 },
    { field: "Ticket", headerName: "Ticket", width: 150 },
    { field: "Fare", headerName: "Fare", type: "number", width: 100 },
    { field: "Cabin", headerName: "Cabin", width: 100 },
    { field: "Embarked", headerName: "Embarked", width: 100 },
  ];
  const legoGridCol: GridColDef[] = [
    { field: "id", headerName: "No.", type: "number", width: 100 },
    { field: "SetId", headerName: "Set ID", width: 100 },
    { field: "Name", headerName: "Name", width: 200 },
    { field: "Year", headerName: "Year", type: "number", width: 100 },
    { field: "Theme", headerName: "Theme", width: 200 },
    { field: "ThemeGroup", headerName: "Theme Group", width: 100 },
    { field: "Subtheme", headerName: "Subtheme", width: 100 },
    { field: "Category", headerName: "Category", width: 100 },
    { field: "Packaging", headerName: "Packaging", width: 150 },
    { field: "NumInstructions", headerName: "Num Instructions", type: "number", width: 150 },
    { field: "Availability", headerName: "Availability", width: 150 },
    { field: "Pieces", headerName: "Pieces", type: "number", width: 100 },
    { field: "Minifigures", headerName: "Minifigures", type: "number", width: 100 },
    { field: "Owned", headerName: "Owned", type: "number", width: 100 },
    { field: "Rating", headerName: "Rating", type: "number", width: 100 },
    { field: "UsdMsrp", headerName: "Usd Msrp (USD)", type: "number", width: 150 },
    { field: "TotalQuantity", headerName: "Total Quantity", type: "number", width: 150 },
    { field: "CurrentPrice", headerName: "Current Price (USD)", type: "number", width: 150 },
  ];
  const houseGridCol: GridColDef[] = [
    { field: "id", headerName: "No.", type: "number", width: 100 },
    { field: "HouseId", headerName: "House ID", type: "number", width: 100 },
    { field: "MSSubClass", headerName: "MS SubClass", width: 150 },
    { field: "MSZoning", headerName: "MS Zoning", width: 100 },
    { field: "LotFrontage", headerName: "Lot Frontage", type: "number", width: 100 },
    { field: "LotArea", headerName: "Lot Area", type: "number", width: 100 },
    { field: "Street", headerName: "Street", width: 100 },
    { field: "Alley", headerName: "Alley", width: 100 },
    { field: "LotShape", headerName: "Lot Shape", width: 100 },
    { field: "LandContour", headerName: "Land Contour", width: 150 },
    { field: "Utilities", headerName: "Utilities", width: 100 },
    { field: "LotConfig", headerName: "Lot Config", width: 100 },
    { field: "LandSlope", headerName: "Land Slope", width: 100 },
    { field: "Neighborhood", headerName: "Neighborhood", width: 150 },
    { field: "Condition1", headerName: "Condition1", width: 100 },
    { field: "Condition2", headerName: "Condition2", width: 100 },
    { field: "BldgType", headerName: "Bldg Type", width: 100 },
    { field: "HouseStyle", headerName: "House Style", width: 100 },
    { field: "OverallQual", headerName: "Overall Qual", type: "number", width: 100 },
    { field: "OverallCond", headerName: "Overall Cond", type: "number", width: 100 },
    { field: "YearBuilt", headerName: "Year Built", type: "number", width: 100 },
    { field: "YearRemodAdd", headerName: "Year Remod Add", type: "number", width: 150 },
    { field: "RoofStyle", headerName: "Roof Style", width: 100 },
    { field: "RoofMatl", headerName: "Roof Matl", width: 100 },
    { field: "Exterior1st", headerName: "Exterior1st", width: 100 },
    { field: "Exterior2nd", headerName: "Exterior2nd", width: 100 },
    { field: "MasVnrType", headerName: "Mas Vnr Type", width: 150 },
    { field: "MasVnrArea", headerName: "Mas Vnr Area", type: "number", width: 150 },
    { field: "ExterQual", headerName: "Exter Qual", width: 100 },
    { field: "ExterCond", headerName: "Exter Cond", width: 100 },
    { field: "Foundation", headerName: "Foundation", width: 100 },
    { field: "BsmtQual", headerName: "Bsmt Qual", width: 100 },
    { field: "BsmtCond", headerName: "Bsmt Cond", width: 100 },
    { field: "BsmtExposure", headerName: "Bsmt Exposure", width: 150 },
    { field: "BsmtFinType1", headerName: "Bsmt Fin Type1", width: 150 },
    { field: "BsmtFinSF1", headerName: "Bsmt Fin SF1", type: "number", width: 150 },
    { field: "BsmtFinType2", headerName: "Bsmt Fin Type2", width: 150 },
    { field: "BsmtFinSF2", headerName: "Bsmt Fin SF2", type: "number", width: 150 },
    { field: "BsmtUnfSF", headerName: "Bsmt Unf SF", type: "number", width: 150 },
    { field: "TotalBsmtSF", headerName: "Total Bsmt SF", type: "number", width: 150 },
    { field: "Heating", headerName: "Heating", width: 100 },
    { field: "HeatingQC", headerName: "Heating QC", width: 100 },
    { field: "CentralAir", headerName: "Central Air", width: 100 },
    { field: "Electrical", headerName: "Electrical", width: 100 },
    { field: "1stFlrSF", headerName: "1st Flr SF", type: "number", width: 100 },
    { field: "2ndFlrSF", headerName: "2nd Flr SF", type: "number", width: 100 },
    { field: "LowQualFinSF", headerName: "Low Qual Fin SF", type: "number", width: 150 },
    { field: "GrLivArea", headerName: "Gr Liv Area", type: "number", width: 150 },
    { field: "BsmtFullBath", headerName: "Bsmt Full Bath", type: "number", width: 150 },
    { field: "BsmtHalfBath", headerName: "Bsmt Half Bath", type: "number", width: 150 },
    { field: "FullBath", headerName: "Full Bath", type: "number", width: 100 },
    { field: "HalfBath", headerName: "Half Bath", type: "number", width: 100 },
    { field: "BedroomAbvGr", headerName: "Bedroom Abv Gr", type: "number", width: 150 },
    { field: "KitchenAbvGr", headerName: "Kitchen Abv Gr", type: "number", width: 150 },
    { field: "KitchenQual", headerName: "Kitchen Qual", width: 150 },
    { field: "TotRmsAbvGrd", headerName: "Tot Rms Abv Grd", type: "number", width: 160 },
    { field: "Functional", headerName: "Functional", width: 100 },
    { field: "Fireplaces", headerName: "Fireplaces", type: "number", width: 100 },
    { field: "FireplaceQu", headerName: "Fireplace Qu", width: 100 },
    { field: "GarageType", headerName: "Garage Type", width: 150 },
    { field: "GarageYrBlt", headerName: "Garage Yr Blt", type: "number", width: 150 },
    { field: "GarageFinish", headerName: "Garage Finish", width: 150 },
    { field: "GarageCars", headerName: "Garage Cars", type: "number", width: 150 },
    { field: "GarageArea", headerName: "Garage Area", type: "number", width: 150 },
    { field: "GarageQual", headerName: "Garage Qual", width: 150 },
    { field: "GarageCond", headerName: "Garage Cond", width: 150 },
    { field: "PavedDrive", headerName: "Paved Drive", width: 150 },
    { field: "WoodDeckSF", headerName: "Wood Deck SF", type: "number", width: 150 },
    { field: "OpenPorchSF", headerName: "Open Porch SF", type: "number", width: 150 },
    { field: "EnclosedPorch", headerName: "Enclosed Porch", type: "number", width: 150 },
    { field: "3SsnPorch", headerName: "3 Ssn Porch", type: "number", width: 100 },
    { field: "ScreenPorch", headerName: "Screen Porch", type: "number", width: 150 },
    { field: "PoolArea", headerName: "Pool Area", type: "number", width: 100 },
    { field: "PoolQC", headerName: "Pool QC", width: 100 },
    { field: "Fence", headerName: "Fence", width: 100 },
    { field: "MiscFeature", headerName: "Misc Feature", width: 150 },
    { field: "MiscVal", headerName: "Misc Val", type: "number", width: 100 },
    { field: "MoSold", headerName: "Mo Sold", type: "number", width: 100 },
    { field: "YrSold", headerName: "Yr Sold", type: "number", width: 100 },
    { field: "SaleType", headerName: "Sale Type", width: 100 },
    { field: "SaleCondition", headerName: "Sale Condition", width: 100 },
    { field: "SalePrice", headerName: "Sale Price", type: "number", width: 100 },
  ];
  const [inputGridCol, SetInputGridCol] = useState(titanicGridCol);
  const [inputData, SetInputDataVal] = useState<(string | number)[][]>([]);
  useEffect(() => {
    if (selectData === INPUT_DATA.titanic) {
      SetInputGridCol(titanicGridCol);
      SetPreTarget("Survived");
    } else if (selectData === INPUT_DATA.lego) {
      SetInputGridCol(legoGridCol);
      SetPreTarget("CurrentPrice");
    } else {
      SetInputGridCol(houseGridCol);
      SetPreTarget("SalePrice");
    }
    props.SetPreprocData([]);
  }, [inputData]);

  useEffect(() => {
    SetInputDataVal([]);
  }, [selectData]);

  const [preprocCols, SetPreprocCols] = useState([""]);
  useEffect(() => {
    const gridCols = preprocCols.map((column: string) => {
      const GridCol = inputGridCol.find((col) => col.field === column);
      if (GridCol !== undefined) {
        GridCol.type = "number";
        return GridCol;
      }

      type Translations = { [key: string]: string; }
      let translations: Translations;
      let width = 100;

      if (selectData === INPUT_DATA.titanic) {
        translations = {
          Embarked: "Embarked", Title: "Title", AgeBin: "Age Bin", FamilySize: "Family Size", FareBin: "Fare Bin", Deck: "Deck",
        };
      } else if (selectData === INPUT_DATA.lego) {
        translations = {
          ThemeGroup: "Theme Group", Category: "Category", Packaging: "Packaging", Availability: "Availability",
          YearBin: "Year Bin", PiecesBin: "Pieces Bin", OwnedBin: "Owned Bin", RatingBin: "Rating Bin", UsdMsrpBin: "Usd Msrp Bin",
          TotalQuantityBin: "Total Quantity Bin", CurrentPriceBin: "Current Price Bin",
        };
        if ((column === "YearBin") || (column === "PiecesBin") || (column === "OwnedBin") || (column === "CurrentPriceBin")) {
          width = 150;
        } else if ((column.startsWith("ThemeGroup")) || (column.startsWith("Category")) || (column.startsWith("Packaging"))
                   || (column.startsWith("Availability")) || (column.startsWith("UsdMsrp"))) {
          width = 200;
        }
      } else {
        translations = {};
      }

      const parts = column.split("_");
      parts[0] = translations[parts[0]] || parts[0];
      const headerName = parts.join("_");

      return { field: column, headerName, type: "number", width };
    });
    gridCols.unshift({ field: "id", headerName: "No.", type: "number", width: 100 });
    SetPreprocGridCol(gridCols);
  }, [preprocCols]);

  const [preprocGridCol, SetPreprocGridCol] = useState<GridColDef[]>([]);
  const [preprocCont, SetPreprocCont] = useState([""]);

  const tooltipTarget = "The column to predict. For example, with Titanic data and target \"Survived\", the model predicts survival from other columns. Some columns cannot be selected as target.";
  const tooltipPreproc = "Transform input data to make it easier to analyze and improve prediction. This system applies simple preprocessing only.";
  const tooltipNan = "Missing or invalid values. Common handling: fill with mean/median/mode or drop rows with missing values.";
  const tooltipBin = "Group data by value ranges (e.g. age 0–9, 10–19, 20–39). Simplifies data for analysis.";
  const tooltipIndex = "Numeric label per category (e.g. dog=0, cat=1, horse=2).";
  const tooltipOneHot = "One column per category; 1 for the matching category, 0 otherwise. Avoids wrongly interpreting numeric order (e.g. dog<cat).";

  return (<>
    <h1>Input data</h1>

    <div className="frame">
      <div id="DataImport" className="grid-def">
        <div className="text-def">Select and import the data for&nbsp;</div>
        <Tooltip title={tooltipML} placement="bottom-start">
          <div className="text-UL">machine learning</div>
        </Tooltip>
        <div className="text-def">.</div>
      </div>

      <div className="text-def margin-sentence">
        <strong>Note: </strong>Hover over underlined terms for descriptions.
      </div>

      <div className="grid-def margin-cont" style={{ columnGap: 30 }}>
        <CommonTButton configKey={CONFIG_KEY.inputData} preSelectDataUS={{ preSelectData, SetPreSelectData }} />
        <FetchButton req={FETCH_REQ.Import} fetchImport={{ preSelectData, SetInputDataVal }} />
        {(waitFetch === FETCH_REQ.Import) && (<CircularProgress />)}
        {(fetchError === FETCH_REQ.Import) && (
          <div className="text-def" style={{ color: "red" }}>Server communication error. Please try again later.</div>
        )}
      </div>

      {(inputData.length > 0) && (<>
        <div className="margin-cont"><DataTable gridCol={inputGridCol} data={inputData} /></div>

        <div id="Preproc" className="separator-line" />

        <div className="grid-def">
          <div className="text-def">Select&nbsp;</div>
          <Tooltip title={tooltipTarget} placement="bottom-start">
            <div className="text-UL">target</div>
          </Tooltip>
          <div className="text-def">&nbsp;column, then run&nbsp;</div>
          <Tooltip title={tooltipPreproc} placement="bottom-start">
            <div className="text-UL">preprocessing</div>
          </Tooltip>
          <div className="text-def">.</div>
        </div>

        <div className="grid-def margin-cont" style={{ columnGap: 30 }}>
          <SelectTarget inputGridCol={inputGridCol} preTarget={preTarget} SetPreTarget={SetPreTarget} />
          <FetchButton req={FETCH_REQ.Preproc} fetchPreproc={{ preTarget, SetPreprocCols, SetPreprocData: props.SetPreprocData, SetPreprocCont }} />
          {(waitFetch === FETCH_REQ.Preproc) && (<CircularProgress />)}
          {(fetchError === FETCH_REQ.Preproc) && (
            <div className="text-def" style={{ color: "red" }}>Server communication error. Please try again later.</div>
          )}
        </div>

        { props.preprocData.length > 0 && (<>
          <div className="text-def margin-cont">
            Term descriptions:
          </div>
          <div className="grid-def" style={{ columnGap: 20 }}>
            <Tooltip title={tooltipNan} placement="bottom-start">
              <div className="text-UL">Missing values</div>
            </Tooltip>
            <Tooltip title={tooltipBin} placement="bottom-start">
              <div className="text-UL">Binning</div>
            </Tooltip>
            <Tooltip title={tooltipIndex} placement="bottom-start">
              <div className="text-UL">Index encoding</div>
            </Tooltip>
            <Tooltip title={tooltipOneHot} placement="bottom-start">
              <div className="text-UL">One-hot encoding</div>
            </Tooltip>
          </div>

          <div className="text-def margin-cont">
            Preprocessing result
            <div style={{ height: 120, maxWidth: 800, overflowY: "scroll", whiteSpace: "pre-wrap" }}>
              { preprocCont.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
          </div>

          <div className="margin-cont"><DataTable gridCol={preprocGridCol} data={props.preprocData} /></div>
        </>)}
      </>)}
    </div>
  </>);
}
