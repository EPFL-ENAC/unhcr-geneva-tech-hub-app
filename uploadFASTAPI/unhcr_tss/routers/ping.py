"""
Handle / requests
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping", status_code=200, description="-- service check --")
async def ping():
    return {"status": "success"}
