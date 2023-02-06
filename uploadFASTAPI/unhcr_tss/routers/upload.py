"""
Handle / uploads
"""
from unhcr_tss.config import settings
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File
from unhcr_tss.utils.s3client import S3_SERVICE

from fastapi import Depends, APIRouter

from unhcr_tss.utils.auth import authorization_checker
from pydantic import BaseModel


class FilePath(BaseModel):
    paths: list[str]


router = APIRouter()

# Object of S3_SERVICE Class
s3_client = S3_SERVICE(settings.S3_ACCESS_KEY_ID,
                       settings.S3_SECRET_ACCESS_KEY, settings.S3_REGION)


@router.post("/upload",
             status_code=200,
             description="-- Upload jpg/png/pdf or any assets to S3 --",
             dependencies=[Depends(authorization_checker)])
async def PostUpload(
        files: list[UploadFile] = File(description="multiple file upload")):
    return {"filenames": [await s3_client.upload_file(file) for file in files]}


@router.delete("/upload",
               status_code=204,
               description="-- Delete assest present in S3 --",
               dependencies=[Depends(authorization_checker)]
               )
async def DeleteUpload(filePath: FilePath):
    [await s3_client.delete_file(path) for path in filePath.paths]
    return
