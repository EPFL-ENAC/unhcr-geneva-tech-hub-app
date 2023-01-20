"""
Handle / uploads
"""
from unhcr_tss.config import settings
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File
from unhcr_tss.utils.s3client import S3_SERVICE

from fastapi import Depends, APIRouter

from unhcr_tss.utils.auth import authorization_checker
from unhcr_tss.utils.mimetype import mimetype_checker

router = APIRouter()

# Object of S3_SERVICE Class
s3_client = S3_SERVICE(settings.S3_ACCESS_KEY_ID,
                       settings.S3_SECRET_ACCESS_KEY, settings.S3_REGION)


@router.post(
    "/upload",
    status_code=200,
    description="-- Upload jpg/png or pdf assets to S3 --",
    dependencies=[Depends(mimetype_checker),
                  Depends(authorization_checker)])
async def upload(
        files: list[UploadFile] = File(description="multiple file upload")):
    return {"filenames": [await s3_client.upload_file(file) for file in files]}
