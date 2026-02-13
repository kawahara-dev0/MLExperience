"""Training service: runs model training."""

import json

from db.database import Database
from Define import MODEL, GetParamDict, INPUT_DATA
from Training import ExecTraining_Nn, ExecTraining_Trdt
from preprocessing import PreprocBasic, PreprocExtra


class TrainingService:
    """Service for executing model training."""

    @staticmethod
    def execute_training(select_data: str, target: str, args: list) -> list:
        """Run training; executes ML training based on model and params."""
        # Get dataframe and run preprocessing
        df = Database.get_dataframe(select_data)
        df, _ = PreprocBasic(select_data, df, target)

        if select_data == INPUT_DATA.titanic.value:
            df, _ = PreprocExtra(df, target, [])

        # Build parameter dict
        param_dict = GetParamDict(args, False)

        # Execute training
        if param_dict["model"] == MODEL.nn.value:
            metrics = ExecTraining_Nn(df, param_dict)
        else:
            metrics = ExecTraining_Trdt(df, param_dict)

        # Ensure result is JSON-serializable (no NaN/inf)
        try:
            json.dumps(metrics, allow_nan=False)
        except ValueError as e:
            raise ValueError(f"Training result contains invalid values: {e}") from e

        return metrics
