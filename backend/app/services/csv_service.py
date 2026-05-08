import pandas as pd
import io
from typing import List
from app.models.process_model import ProcessInput

class CSVService:
    """CSV parsing and export service."""

    @staticmethod
    def parse_processes(csv_content: bytes) -> List[ProcessInput]:
        df = pd.read_csv(io.BytesIO(csv_content))
        # Ensure required columns
        required = {"pid", "arrival_time", "burst_time"}
        if not required.issubset(df.columns):
            raise ValueError(f"CSV must contain columns: {required}")
            
        processes = []
        for _, row in df.iterrows():
            processes.append(ProcessInput(
                pid=int(row['pid']),
                arrival_time=int(row['arrival_time']),
                burst_time=int(row['burst_time']),
                priority=int(row.get('priority', 5))
            ))
        return processes

    @staticmethod
    def export_report(data: List[dict]) -> str:
        df = pd.DataFrame(data)
        return df.to_csv(index=False)
