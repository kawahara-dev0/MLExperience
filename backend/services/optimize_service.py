"""Optimize service: hyperparameter optimization."""

from db.database import Database
from Define import GetParamDict, INPUT_DATA
from Optimize import Optimize
from preprocessing import PreprocBasic, PreprocExtra


class OptimizeService:
    """Service for hyperparameter optimization."""

    @staticmethod
    def optimize(select_data: str, target: str, args: list) -> dict:
        """Run optimization; optimize model hyperparameters."""
        df = Database.get_dataframe(select_data)
        df, _ = PreprocBasic(select_data, df, target)

        if select_data == INPUT_DATA.titanic.value:
            df, _ = PreprocExtra(df, target, [])

        param_dict = GetParamDict(args, True)
        config = Optimize(df, param_dict)
        return config
