"""Data service: data import and preprocessing."""

import numpy as np

from db.database import Database
from Define import INPUT_DATA, GetProblem
from preprocessing import PreprocBasic, PreprocExtra


class DataService:
    """Service for data import and preprocessing."""

    @staticmethod
    def import_data(select_data: str) -> list:
        """Import data; load selected table from DB and return as list."""
        df = Database.get_dataframe(select_data)
        df = df.replace([np.nan, np.inf, -np.inf], None)
        return df.values.tolist()

    @staticmethod
    def preprocess_data(select_data: str, target: str) -> list:
        """Run preprocessing; load data, preprocess, and return result."""
        df = Database.get_dataframe(select_data)
        df, preproc_cont = PreprocBasic(select_data, df, target)

        if select_data == INPUT_DATA.titanic.value:
            df, preproc_cont = PreprocExtra(df, target, preproc_cont)

        problem, unique_num = GetProblem(df, target)
        df = df.replace([np.nan, np.inf, -np.inf], None)
        return [
            df.columns.tolist(),
            df.values.tolist(),
            preproc_cont,
            [problem, unique_num]
        ]
