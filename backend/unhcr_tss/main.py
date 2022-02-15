"""
Entrypoint for FastAPI application
https://fastapi.tiangolo.com/tutorial/bigger-applications/
"""
from fastapi import FastAPI
from fastapi.logger import logger
from fastapi.middleware.cors import CORSMiddleware

from unhcr_tss import __name__ as title
from unhcr_tss import __version__
from unhcr_tss.config import cors_enabled, root_path
from unhcr_tss.routers import root

app = FastAPI(
    title=title,
    version=__version__,
    root_path=root_path,
)

if cors_enabled:
    logger.warn("cors enabled")
else:
    logger.warn("cors disabled")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(root.router)
