"""Database: connection and query execution."""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

from Define import INPUT_DATA


load_dotenv(".env")


class Database:
    """Database access class."""

    ALLOWED_TABLES = {
        INPUT_DATA.titanic.value,
        INPUT_DATA.lego.value,
        INPUT_DATA.house.value,
    }

    @staticmethod
    def get_dataframe(select_data: str) -> pd.DataFrame:
        """Load dataframe from the specified table."""
        if select_data not in Database.ALLOWED_TABLES:
            raise ValueError(f"Invalid table name: {select_data}")

        username = os.getenv("DB_USERNAME")
        password = os.getenv("DB_PASSWORD")
        host = os.getenv("DB_HOST")
        db_name = os.getenv("DB_NAME")

        if not all([username, password, host, db_name]):
            raise ValueError("Database connection info is missing")

        engine = None
        try:
            engine = create_engine(f"postgresql+psycopg://{username}:{password}@{host}/{db_name}")
            query = text(f"SELECT * FROM {select_data}")
            df = pd.read_sql_query(query, engine)
            return df

        except SQLAlchemyError as e:
            raise Exception(f"Database error: {select_data}, {e}")

        except Exception as e:
            raise Exception(f"Unexpected error: {select_data}, {e}")

        finally:
            if engine is not None:
                engine.dispose()
