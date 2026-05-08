"""
KernelFlow – FastAPI Application Entry Point
Configures middleware, CORS, and mounts all API routers.
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api import simulation, algorithms, compare, recommend, import_export, metrics
from app.utils.logger import get_logger

logger = get_logger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: startup and shutdown hooks."""
    # Ensure upload/export directories exist
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(settings.export_dir, exist_ok=True)
    logger.info(f"KernelFlow v{settings.app_version} starting up...")
    yield
    logger.info("KernelFlow shutting down.")


def create_app() -> FastAPI:
    """Factory function to create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="CPU Scheduling Simulation & Analysis Platform",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    prefix = "/api"
    app.include_router(simulation.router, prefix=prefix, tags=["Simulation"])
    app.include_router(algorithms.router, prefix=prefix, tags=["Algorithms"])
    app.include_router(compare.router, prefix=prefix, tags=["Comparison"])
    app.include_router(recommend.router, prefix=prefix, tags=["Recommendation"])
    app.include_router(import_export.router, prefix=prefix, tags=["Import/Export"])
    app.include_router(metrics.router, prefix=prefix, tags=["Metrics"])

    @app.get("/", tags=["Health"])
    async def root():
        return {"status": "ok", "app": settings.app_name, "version": settings.app_version}

    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "healthy"}

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
