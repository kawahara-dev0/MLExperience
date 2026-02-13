"""ML Experience System: shared definitions and helpers."""

from enum import Enum


class FETCH_REQ(Enum):
    Import = "Import"
    Preproc = "Preproc"
    Optimize = "Optimize"
    Training = "Training"


class PROBLEM(Enum):
    regression = "regression"
    classification = "classification"


class INPUT_DATA(Enum):
    titanic = "titanic"
    lego = "lego"
    house = "house"


class MODEL(Enum):
    nn = "nn"
    rf = "rf"
    svm = "svm"
    knn = "knn"


REQUIRED_ARGS_COUNT = {
    MODEL.nn.value: 26,  # target, model, 5 layers x 4 (last,layer,param,af), optimizer, lr, miniBatch, epoch
    MODEL.rf.value: 6,   # target, model, nEstimators, maxFeatures, maxDepth, minSamplesSplit
    MODEL.svm.value: 5,  # target, model, kernel, c, gamma
    MODEL.knn.value: 6,  # target, model, nNeighbors, weights, algorithm, metric
}


def GetProblem(df, target):
    """Determine problem type (regression/classification) from target column."""
    regression = [
        # Titanic
        "Age", "SibSp", "Parch", "Fare",
        # Lego
        "Year", "NumInstructions", "Pieces", "Minifigures", "Owned", "Rating", "UsdMsrp", "TotalQuantity", "CurrentPrice",
        # House
        "LotFrontage", "LotArea", "YearBuilt", "YearRemodAdd", "MasVnrArea", "BsmtFinSF1", "BsmtFinSF2", "BsmtUnfSF",
        "TotalBsmtSF", "1stFlrSF", "2ndFlrSF", "LowQualFinSF", "GrLivArea", "BsmtFullBath", "BsmtHalfBath", "FullBath",
        "HalfBath", "BedroomAbvGr", "KitchenAbvGr", "TotRmsAbvGrd", "Fireplaces", "GarageYrBlt", "GarageCars",
        "GarageArea", "WoodDeckSF", "OpenPorchSF", "EnclosedPorch", "3SsnPorch", "ScreenPorch", "PoolArea", "MiscVal",
        "MoSold", "YrSold", "SalePrice"]
    
    if target in regression:
        return PROBLEM.regression, 1
    else:
        return PROBLEM.classification, df[target].nunique()


def GetPreprocDict(selectData):
    """Return preprocessing config (field, headerName, fillna, proc, etc.) for the selected dataset."""
    if selectData == INPUT_DATA.titanic.value:
        return [
            {"field": "PassengerId", "headerName": "Passenger ID", "proc": "drop"},
            {"field": "Sex", "headerName": "Sex", "proc": "index"},
            {"field": "Ticket", "headerName": "Ticket", "proc": "drop"},
            {"field": "Fare", "headerName": "Fare", "proc": "cut", "bins": 4,
             "cont1": "- Fare binned into 4 bins; FareBin column added."},
            {"field": "Embarked", "headerName": "Embarked", "fillna": "mode", "proc": "onehot"}]

    elif selectData == INPUT_DATA.lego.value:
        return [
            {"field": "SetId", "headerName": "Set ID", "proc": "drop"},
            {"field": "Name", "headerName": "Name", "proc": "drop"},
            {"field": "Year", "headerName": "Year",
             "proc": "cut", "bins": [1970, 1980, 1990, 2000, 2010, float("inf")], "labels": [0, 1, 2, 3, 4],
             "cont1": "- Year binned by decade; YearBin column added."},
            {"field": "Theme", "headerName": "Theme", "proc": "index"},
            {"field": "ThemeGroup", "headerName": "Theme Group", "fillna": "Unknown", "proc": "onehot"},
            {"field": "Subtheme", "headerName": "Subtheme", "fillna": "Unknown", "proc": "index"},
            {"field": "Category", "headerName": "Category", "proc": "onehot", "drop": "Normal"},
            {"field": "Packaging", "headerName": "Packaging", "proc": "onehot", "drop": "{Not specified}"},
            {"field": "Availability", "headerName": "Availability", "proc": "onehot", "drop": "{Not specified}"},
            {"field": "Pieces", "headerName": "Pieces",
             "fillna": "groupMedian", "group": "Theme", "groupName": "Theme",
             "proc": "cut", "bins": [0, 100, 500, 1000, 2000, float("inf")], "labels": [0, 1, 2, 3, 4],
             "cont1": "- Pieces binned; PiecesBin column added."},
            {"field": "Minifigures", "headerName": "Minifigures", "fillna": 0, "targetNotDrop": True},
            {"field": "Owned", "headerName": "Owned",
             "fillna": "groupMedian", "group": "Theme", "groupName": "Theme",
             "proc": "cut", "bins": [0, 500, 1000, 5000, 10000, float("inf")], "labels": [0, 1, 2, 3, 4],
             "cont1": "- Owned binned; OwnedBin column added."},
            {"field": "Rating", "headerName": "Rating",
             "proc": "cut", "bins": [0, 1, 2, 3, 4, float("inf")], "labels": [0, 1, 2, 3, 4],
             "cont1": "- Rating binned; RatingBin column added."},
            {"field": "UsdMsrp", "headerName": "MSRP (USD)",
             "fillna": "groupMedian", "group": "Theme", "groupName": "Theme",
             "proc": "cut", "bins": [0, 50, 100, 300, 500, float("inf")], "labels": [0, 1, 2, 3, 4],
             "cont1": "- UsdMsrp binned; UsdMsrpBin column added."},
            {"field": "TotalQuantity", "headerName": "Total Quantity", "fillna": 0,
             "proc": "cut", "bins": [0, 50, 100, 200, 300, float("inf")], "labels": [0, 1, 2, 3, 4],
             "cont1": "- TotalQuantity binned; TotalQuantityBin column added."},
            {"field": "CurrentPrice", "headerName": "Current Price (USD)",
             "fillna": "groupMedian", "group": "Theme", "groupName": "Theme",
             "proc": "cut", "bins": [0, 50, 100, 300, 500, 1000, float("inf")], "labels": [0, 1, 2, 3, 4, 5],
             "cont1": "- CurrentPrice binned; CurrentPriceBin column added."}
        ]

    else:
        return [
            {"field": "HouseId", "headerName": "House ID", "proc": "drop"},
            {"field": "MSSubClass", "headerName": "Building class", "proc": "index"},
            {"field": "MSZoning", "headerName": "Zoning", "proc": "index"},
            {"field": "LotFrontage", "headerName": "Lot frontage", "fillna": 0},
            {"field": "Street", "headerName": "Street type", "proc": "index"},
            {"field": "Alley", "headerName": "Alley type", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "LotShape", "headerName": "Lot shape", "proc": "index"},
            {"field": "LandContour", "headerName": "Land contour", "proc": "index"},
            {"field": "Utilities", "headerName": "Utilities", "proc": "index"},
            {"field": "LotConfig", "headerName": "Lot config", "proc": "index"},
            {"field": "LandSlope", "headerName": "Land slope", "proc": "index"},
            {"field": "Neighborhood", "headerName": "Neighborhood", "proc": "index"},
            {"field": "Condition1", "headerName": "Condition 1", "proc": "index"},
            {"field": "Condition2", "headerName": "Condition 2", "proc": "index"},
            {"field": "BldgType", "headerName": "Building type", "proc": "index"},
            {"field": "HouseStyle", "headerName": "House style", "proc": "index"},
            {"field": "RoofStyle", "headerName": "Roof style", "proc": "index"},
            {"field": "RoofMatl", "headerName": "Roof material", "proc": "index"},
            {"field": "Exterior1st", "headerName": "Exterior 1st", "proc": "index"},
            {"field": "Exterior2nd", "headerName": "Exterior 2nd", "proc": "index"},
            {"field": "MasVnrType", "headerName": "Masonry veneer type", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "MasVnrArea", "headerName": "Masonry veneer area", "fillna": 0, "targetNotDrop": True},
            {"field": "ExterQual", "headerName": "Exterior quality", "proc": "index"},
            {"field": "ExterCond", "headerName": "Exterior condition", "proc": "index"},
            {"field": "Foundation", "headerName": "Foundation", "proc": "index"},
            {"field": "BsmtQual", "headerName": "Basement quality", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "BsmtCond", "headerName": "Basement condition", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "BsmtExposure", "headerName": "Basement exposure", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "BsmtFinType1", "headerName": "Basement finish type 1", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "BsmtFinType2", "headerName": "Basement finish type 2", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "Heating", "headerName": "Heating", "proc": "index"},
            {"field": "HeatingQC", "headerName": "Heating QC", "proc": "index"},
            {"field": "CentralAir", "headerName": "Central air", "proc": "index"},
            {"field": "Electrical", "headerName": "Electrical", "fillna": "SBrkr", "proc": "index"},
            {"field": "KitchenQual", "headerName": "Kitchen quality", "proc": "index"},
            {"field": "Functional", "headerName": "Functional", "proc": "index"},
            {"field": "FireplaceQu", "headerName": "Fireplace quality", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "GarageType", "headerName": "Garage type", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "GarageYrBlt", "headerName": "Garage year built", "fillna": 0, "targetNotDrop": True},
            {"field": "GarageFinish", "headerName": "Garage finish", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "GarageQual", "headerName": "Garage quality", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "GarageCond", "headerName": "Garage condition", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "PavedDrive", "headerName": "Paved driveway", "proc": "index"},
            {"field": "PoolQC", "headerName": "Pool quality", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "Fence", "headerName": "Fence", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "MiscFeature", "headerName": "Misc feature", "fillna": "None", "targetNotDrop": True, "proc": "index"},
            {"field": "SaleType", "headerName": "Sale type", "proc": "index"},
            {"field": "SaleCondition", "headerName": "Sale condition", "proc": "index"}
        ]
        
def GetParamDict(reqArg, optimize):
    config = {
        MODEL.nn.value: {
            "keys": ["target", "model", "last1", "layer1", "param1", "af1", "last2", "layer2", "param2", "af2",
                     "last3", "layer3", "param3", "af3", "last4", "layer4", "param4", "af4", "last5", "layer5", "param5", "af5",
                     "optimizer", "lr", "miniBatch", "epoch"],
            "type_conversions": {
                "last1": str_to_bool, "last2": str_to_bool, "last3": str_to_bool, "last4": str_to_bool, "last5": str_to_bool,
                "lr": float, "miniBatch": int, "epoch": int}
        },
        MODEL.rf.value: {
            "keys": ["target", "model", "nEstimators", "maxFeatures", "maxDepth", "minSamplesSplit"],
            "type_conversions": {"nEstimators": int, "maxDepth": int, "minSamplesSplit": int}
        },
        MODEL.svm.value: {
            "keys": ["target", "model", "kernel", "c", "gamma"],
            "type_conversions": {"c": float, "gamma": float}
        },
        MODEL.knn.value: {
            "keys": ["target", "model", "nNeighbors", "weights", "algorithm", "metric"],
            "type_conversions": {"nNeighbors": int}
        },
        FETCH_REQ.Optimize.value: {
            "keys": ["target", "model"],
            "type_conversions": {}
        }
    }
    if optimize:
        keys = config[FETCH_REQ.Optimize.value]["keys"]
        type_conversions = config[FETCH_REQ.Optimize.value]["type_conversions"]
    else:
        model = reqArg[1]
        keys = config[model]["keys"]
        type_conversions = config[model]["type_conversions"]
    
    return {key: (type_conversions[key](reqArg[idx]) if key in type_conversions else reqArg[idx]) for idx, key in enumerate(keys)}
    
def str_to_bool(val):
    """Convert string True/False to bool."""
    return (val == "True")
