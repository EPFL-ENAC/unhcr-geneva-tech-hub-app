"""
Handle / uploads
"""
from unhcr_tss.config import settings
from fastapi.datastructures import UploadFile

from fastapi.param_functions import File
from unhcr_tss.utils.s3client import S3_SERVICE

from fastapi import Cookie, Header, APIRouter

from typing import Union
from unhcr_tss.utils.auth import isUserLoggedIn

from fastapi.exceptions import HTTPException

router = APIRouter()

# Object of S3_SERVICE Class
s3_client = S3_SERVICE(settings.S3_ACCESS_KEY_ID,
                       settings.S3_SECRET_ACCESS_KEY, settings.S3_REGION)


@router.post("/upload",
             status_code=200,
             description="-- Upload image asset to S3 --")
async def upload(files: list[UploadFile] = File(
    description="Multiple files as UploadFile"),
                 AuthSession: Union[str, None] = Cookie(default=None),
                 Authorization: Union[str, None] = Header(default=None)):
    if (not isUserLoggedIn(AuthSession, Authorization)):
        raise HTTPException(status_code=401,
                            detail="You are not authenticated")
    return {"filenames": [await s3_client.upload_file(file) for file in files]}
