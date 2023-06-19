"""
Handle / requests
"""
from fastapi import APIRouter

from unhcr_tss import __name__ as name
from unhcr_tss import __version__

router = APIRouter()


@router.get("/")
async def root():
    """
    Get Info
    """
    return {"name": name, "version": __version__}
