"""
Handle / requests
"""
from fastapi import APIRouter

from unhcr_tss import __name__ as name
from unhcr_tss import __version__
from unhcr_tss.models import Info

router = APIRouter()


@router.get("/", response_model=Info)
async def root() -> Info:
    """
    Get Info
    """
    return Info(name=name, version=__version__)
