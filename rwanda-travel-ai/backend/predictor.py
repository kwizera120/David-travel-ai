from functools import lru_cache
from pathlib import Path

import pandas as pd

from backend.model_loader import model

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "routes.xlsx"


def _normalize(value) -> str:
    return str(value).strip().lower()


@lru_cache(maxsize=1)
def _load_routes_dataframe() -> pd.DataFrame:
    if not DATA_PATH.exists() or DATA_PATH.stat().st_size == 0:
        return pd.DataFrame()

    try:
        dataframe = pd.read_excel(DATA_PATH, sheet_name="Routes", engine="openpyxl")
    except Exception:
        return pd.DataFrame()

    return dataframe.fillna("")


def _lookup_known_price(from_city, to_city, distance_km, transport_type, demand):
    dataframe = _load_routes_dataframe()
    if dataframe.empty:
        return None

    filtered = dataframe[
        dataframe["from_city"].astype(str).str.strip().str.lower().eq(_normalize(from_city))
        & dataframe["to_city"].astype(str).str.strip().str.lower().eq(_normalize(to_city))
        & dataframe["transport_type"].astype(str).str.strip().str.lower().eq(_normalize(transport_type))
        & dataframe["demand"].astype(str).str.strip().str.lower().eq(_normalize(demand))
    ]

    if filtered.empty:
        return None

    closest_match = filtered.iloc[(filtered["Distance_km"].astype(float) - float(distance_km)).abs().argsort()].head(1)
    return float(closest_match["price_rwf"].iloc[0])


def predict_price(from_city, to_city, distance_km, transport_type, demand):
    known_price = _lookup_known_price(from_city, to_city, distance_km, transport_type, demand)
    if known_price is not None:
        return known_price

    input_data = pd.DataFrame(
        [[from_city, to_city, distance_km, transport_type, demand]],
        columns=["from_city", "to_city", "Distance_km", "transport_type", "demand"],
    )

    return float(model.predict(input_data)[0])
