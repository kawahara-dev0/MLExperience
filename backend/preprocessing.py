"""Preprocessing: data preprocessing logic."""

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

from Define import GetPreprocDict


def PreprocBasic(selectData, df, target):
    """Apply basic (generic) preprocessing."""
    preprocCont = []
    original_columns = df.columns.tolist()
    label_encoder = LabelEncoder()
    preprocDict = GetPreprocDict(selectData)

    for item in preprocDict:
        if item.get("fillna") is not None:
            if (target != item["field"]) or (item.get("targetNotDrop") is not None):
                if item["fillna"] == "mode":
                    df[item["field"]] = df[item["field"]].fillna(df[item["field"]].mode()[0])
                    preprocCont.append(f"- Filled missing values in \"{item['headerName']}\" with mode.")
                elif item["fillna"] == "groupMedian":
                    SetGroupMedian(df, item["field"], item["group"])
                    preprocCont.append(f"- Filled missing values in \"{item['headerName']}\" with group median by \"{item['groupName']}\", otherwise using the overall median.")
                else:
                    df[item["field"]] = df[item["field"]].fillna(item["fillna"])
                    preprocCont.append(f"- Filled missing values in \"{item['headerName']}\" with \"{item['fillna']}\".")
            else:
                df.dropna(subset=[item["field"]], inplace=True)
                preprocCont.append(f"- Dropped rows with missing \"{item['headerName']}\".")

        if item.get("proc") is None:
            continue

        if item["proc"] == "drop":
            df.drop(columns=[item["field"]], inplace=True)
            preprocCont.append(f"- Dropped \"{item['headerName']}\" (low relevance to target).")
        elif item["proc"] == "index":
            df[item["field"]] = label_encoder.fit_transform(df[item["field"]])
            preprocCont.append(f"- Encoded \"{item['headerName']}\" as index.")
        elif item["proc"] == "onehot":
            if target != item["field"]:
                df = pd.get_dummies(df, columns=[item["field"]])
                if item.get("drop") is not None:
                    df.drop(columns=[item["field"] + "_" + item["drop"]], inplace=True)
                preprocCont.append(f"- One-hot encoded \"{item['headerName']}\".")
            else:
                df[item["field"]] = label_encoder.fit_transform(df[item["field"]])
                preprocCont.append(f"- Encoded \"{item['headerName']}\" as index.")
        elif item["proc"] == "cut":
            if target != item["field"]:
                if type(item["bins"]) is int:
                    df[item["field"] + "Bin"] = pd.qcut(df[item["field"]], item["bins"], labels=list(range(item["bins"])))
                else:
                    df[item["field"] + "Bin"] = pd.cut(df[item["field"]], bins=item["bins"], labels=item["labels"], include_lowest=True)
                preprocCont.append(item["cont1"])
                if item.get("cont2") is not None:
                    preprocCont.append(item["cont2"])
                if item.get("cont3") is not None:
                    preprocCont.append(item["cont3"])
                df.drop(columns=[item["field"]], inplace=True)
                preprocCont.append(f"- Dropped \"{item['headerName']}\".")

    new_columns = [col for col in df.columns if col not in original_columns]
    for col in new_columns:
        df[col] = df[col].astype(int)
    return df, preprocCont


def PreprocExtra(df, target, preprocCont):
    """Apply Titanic-specific preprocessing."""
    original_columns = df.columns.tolist()
    df["Title"] = df["Name"].str.extract(r" ([A-Za-z]+)\.", expand=False)
    preprocCont.append("- Extracted title from Name.")
    df.drop(columns=["Name"], inplace=True)
    preprocCont.append("- Dropped Name.")
    if target != "Age":
        SetGroupMedian(df, "Age", "Title")
        preprocCont.append("- Filled missing Age with group median by Title, otherwise using the overall median.")
        df["AgeBin"] = pd.cut(df["Age"], bins=[0, 10, 20, 40, 60, float("inf")], labels=[0, 1, 2, 3, 4], include_lowest=True)
        preprocCont.append("- Binned Age; added AgeBin column (0-9: child, 10-19: teen, 20-39: adult, 40-59: middle, 60+: senior).")
        df.drop(columns=["Age"], inplace=True)
        preprocCont.append("- Dropped Age.")
    else:
        df.dropna(subset=["Age"], inplace=True)
        preprocCont.append("- Dropped rows with missing Age.")
    df = pd.get_dummies(df, columns=["Title"])
    preprocCont.append("- One-hot encoded Title.")
    if (target != "SibSp") and (target != "Parch"):
        df["FamilySize"] = df["SibSp"] + df["Parch"] + 1
        preprocCont.append("- Added FamilySize column.")
    df["Cabin"] = df["Cabin"].fillna("U")
    df["Deck"] = df["Cabin"].str[0]
    preprocCont.append("- Extracted Deck from Cabin (U when missing).")
    df = pd.get_dummies(df, columns=["Deck"])
    preprocCont.append("- One-hot encoded Deck.")
    df.drop(columns=["Cabin"], inplace=True)
    preprocCont.append("- Dropped Cabin.")
    new_columns = [col for col in df.columns if col not in original_columns]
    for col in new_columns:
        df[col] = df[col].astype(int)
    return df, preprocCont


def SetGroupMedian(df, targetCol, groupCol):
    """Fill missing values in targetCol with group median by groupCol; fallback to overall median."""
    groupMedians = df.groupby(groupCol)[targetCol].transform("median")
    overallMedian = df[targetCol].median()
    df[targetCol] = np.where(df[targetCol].isna(),
                             np.where(groupMedians.isna(), overallMedian, groupMedians),
                             df[targetCol])
