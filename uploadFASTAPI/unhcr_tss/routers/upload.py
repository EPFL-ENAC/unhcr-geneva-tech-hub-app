"""
Handle / uploads
"""
from fastapi import APIRouter
from unhcr_tss.config import settings
from fastapi.datastructures import UploadFile

from fastapi.param_functions import File
from unhcr_tss.utils.s3client import S3_SERVICE

router = APIRouter()

# Object of S3_SERVICE Class
s3_client = S3_SERVICE(settings.S3_ACCESS_KEY_ID,
                       settings.S3_SECRET_ACCESS_KEY, settings.S3_REGION)


@router.post("/upload",
             status_code=200,
             description="-- Upload image asset to S3 --")
async def upload(
    # fileobject: UploadFile = File(...)
    files: list[UploadFile] = File(
        description="Multiple files as UploadFile")):
    return {"filenames": [await s3_client.upload_file(file) for file in files]}
