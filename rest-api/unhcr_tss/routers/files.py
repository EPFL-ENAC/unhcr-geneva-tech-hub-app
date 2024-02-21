"""
Handle / uploads
"""
from fastapi import Depends, APIRouter
from fastapi.datastructures import UploadFile
from fastapi.exceptions import HTTPException
from fastapi.param_functions import File
from pydantic import BaseModel
from unhcr_tss.utils.auth import authorization_checker
from unhcr_tss.utils.azure_blob_service import AzureBlobService
from unhcr_tss.config import settings
from unhcr_tss.utils.size import size_checker


class FilePath(BaseModel):
    paths: list[str]

class FileDownloadPath(BaseModel):
    path: str

router = APIRouter()

azure_blob_service = AzureBlobService(
    account_name=settings.AZURE_ACCOUNT_NAME,
    account_key=settings.AZURE_ACCOUNT_KEY,
    container_name=settings.AZURE_CONTAINER_NAME
)

@router.post("/files", status_code=200, description="-- Upload files to Azure Blob Storage --",
             dependencies=[Depends(authorization_checker), Depends(size_checker)])
async def PostUpload(files: list[UploadFile] = File(description="multiple file upload")):
    try:
        return {"filenames": [await azure_blob_service.upload_file(file) for file in files]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/files", status_code=204, description="-- Delete files from Azure Blob Storage --",
               dependencies=[Depends(authorization_checker)])
async def DeleteUpload(filePath: FilePath):
    try:
        [await azure_blob_service.delete_file(path) for path in filePath.paths]
        return {"detail": "Files deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files/download", status_code=200, description="-- Get URL to download a file from Azure Blob Storage --")
async def GetFile(file_download_path: FileDownloadPath):
    try:
        file_url = await azure_blob_service.get_file_url(file_download_path.path)
        return {"file_url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))