-- ML Experience System: database init script (runs on first container start)

CREATE TABLE IF NOT EXISTS titanic (
    "PassengerId" INTEGER PRIMARY KEY,
    "Survived" INTEGER,
    "Pclass" INTEGER,
    "Name" TEXT,
    "Sex" TEXT,
    "Age" FLOAT,
    "SibSp" INTEGER,
    "Parch" INTEGER,
    "Ticket" TEXT,
    "Fare" FLOAT,
    "Cabin" TEXT,
    "Embarked" TEXT
);

CREATE TABLE IF NOT EXISTS lego (
    "SetId" TEXT PRIMARY KEY,
    "Name" TEXT,
    "Year" FLOAT,
    "Theme" TEXT,
    "ThemeGroup" TEXT,
    "Subtheme" TEXT,
    "Category" TEXT,
    "Packaging" TEXT,
    "NumInstructions" FLOAT,
    "Availability" TEXT,
    "Pieces" FLOAT,
    "Minifigures" FLOAT,
    "Owned" FLOAT,
    "Rating" FLOAT,
    "UsdMsrp" FLOAT,
    "TotalQuantity" FLOAT,
    "CurrentPrice" FLOAT
);

CREATE TABLE IF NOT EXISTS house (
    "HouseId" INTEGER PRIMARY KEY,
    "MSSubClass" INTEGER,
    "MSZoning" TEXT,
    "LotFrontage" FLOAT,
    "LotArea" INTEGER,
    "Street" TEXT,
    "Alley" TEXT,
    "LotShape" TEXT,
    "LandContour" TEXT,
    "Utilities" TEXT,
    "LotConfig" TEXT,
    "LandSlope" TEXT,
    "Neighborhood" TEXT,
    "Condition1" TEXT,
    "Condition2" TEXT,
    "BldgType" TEXT,
    "HouseStyle" TEXT,
    "OverallQual" INTEGER,
    "OverallCond" INTEGER,
    "YearBuilt" INTEGER,
    "YearRemodAdd" INTEGER,
    "RoofStyle" TEXT,
    "RoofMatl" TEXT,
    "Exterior1st" TEXT,
    "Exterior2nd" TEXT,
    "MasVnrType" TEXT,
    "MasVnrArea" FLOAT,
    "ExterQual" TEXT,
    "ExterCond" TEXT,
    "Foundation" TEXT,
    "BsmtQual" TEXT,
    "BsmtCond" TEXT,
    "BsmtExposure" TEXT,
    "BsmtFinType1" TEXT,
    "BsmtFinSF1" FLOAT,
    "BsmtFinType2" TEXT,
    "BsmtFinSF2" FLOAT,
    "BsmtUnfSF" FLOAT,
    "TotalBsmtSF" FLOAT,
    "Heating" TEXT,
    "HeatingQC" TEXT,
    "CentralAir" TEXT,
    "Electrical" TEXT,
    "1stFlrSF" FLOAT,
    "2ndFlrSF" FLOAT,
    "LowQualFinSF" FLOAT,
    "GrLivArea" FLOAT,
    "BsmtFullBath" FLOAT,
    "BsmtHalfBath" FLOAT,
    "FullBath" INTEGER,
    "HalfBath" INTEGER,
    "BedroomAbvGr" INTEGER,
    "KitchenAbvGr" INTEGER,
    "KitchenQual" TEXT,
    "TotRmsAbvGrd" INTEGER,
    "Functional" TEXT,
    "Fireplaces" INTEGER,
    "FireplaceQu" TEXT,
    "GarageType" TEXT,
    "GarageYrBlt" FLOAT,
    "GarageFinish" TEXT,
    "GarageCars" FLOAT,
    "GarageArea" FLOAT,
    "GarageQual" TEXT,
    "GarageCond" TEXT,
    "PavedDrive" TEXT,
    "WoodDeckSF" FLOAT,
    "OpenPorchSF" FLOAT,
    "EnclosedPorch" FLOAT,
    "3SsnPorch" FLOAT,
    "ScreenPorch" FLOAT,
    "PoolArea" FLOAT,
    "PoolQC" TEXT,
    "Fence" TEXT,
    "MiscFeature" TEXT,
    "MiscVal" FLOAT,
    "MoSold" INTEGER,
    "YrSold" INTEGER,
    "SaleType" TEXT,
    "SaleCondition" TEXT,
    "SalePrice" FLOAT
);

CREATE INDEX IF NOT EXISTS idx_titanic_survived ON titanic("Survived");
CREATE INDEX IF NOT EXISTS idx_lego_theme ON lego("CurrentPrice");
CREATE INDEX IF NOT EXISTS idx_house_saleprice ON house("SalePrice");

-- Import CSV from /docker-entrypoint-initdb.d/
\echo 'Importing data...'

\copy titanic FROM '/docker-entrypoint-initdb.d/titanic.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '');
\copy lego FROM '/docker-entrypoint-initdb.d/lego.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL '');
\copy house FROM '/docker-entrypoint-initdb.d/house.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NA');

\echo 'Import complete.'
