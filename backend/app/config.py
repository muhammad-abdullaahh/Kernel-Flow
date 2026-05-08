"""
KernelFlow Configuration Module
Loads environment variables and provides typed settings via Pydantic.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Server settings
    app_name: str = "KernelFlow"
    app_version: str = "1.0.0"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    allowed_origins: list[str] = ["*"]

    # Upload / Export directories
    upload_dir: str = "uploads"
    export_dir: str = "exports"

    # Simulation defaults
    default_time_quantum: int = 2
    max_processes: int = 20
    max_simulation_time: int = 200

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
