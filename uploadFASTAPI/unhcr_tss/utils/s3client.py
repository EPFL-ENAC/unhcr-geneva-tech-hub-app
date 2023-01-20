from aiobotocore.session import get_session
from io import BytesIO
from fastapi.logger import logger
from typing import Tuple
import datetime
from PIL import Image
from fastapi.exceptions import HTTPException
from unhcr_tss.config import settings
from unhcr_tss.utils.mimetype import image_mimetypes, pdf_mimetypes
from fastapi.datastructures import UploadFile
import os


class S3_SERVICE(object):

    def __init__(self, s3_access_key_id, s3_secret_access_key, region, *args,
                 **kwargs):
        self.s3_access_key_id = s3_access_key_id
        self.s3_secret_access_key = s3_secret_access_key
        self.region = region

    async def convert_image(self, uploadFile: UploadFile):
        request_object_content = await uploadFile.read()
        image = Image.open(BytesIO(request_object_content))
        data = BytesIO()
        image.save(data, format="webp", quality=60)
        return data

    async def get_unique_filename(self,
                                  filename: str,
                                  ext: str = "") -> Tuple[str, str]:
        current_time = datetime.datetime.now()
        # generate unique name for the file
        unique_name = str(current_time.timestamp()).replace('.', '')
        split_file_name = os.path.splitext(filename)
        ext = ext if ext != "" else split_file_name[1]
        name = split_file_name[0]
        return (f"{unique_name}{split_file_name[0]}{ext}", name)

    async def upload_image(self, uploadFile: UploadFile):
        data = await self.convert_image(uploadFile)
        mimetype = "image/webp"
        (unique_name,
         name) = await self.get_unique_filename(uploadFile.filename, ".webp")

        key = f"{settings.S3_Key}{unique_name}"
        uploads3 = await self.upload_fileobj(bucket=settings.S3_Bucket,
                                             key=key,
                                             data=data.getvalue(),
                                             mimetype=mimetype)
        (unique_origin_name,
         origin_name) = await self.get_unique_filename(uploadFile.filename)
        key_origin = f"{settings.S3_Key}{unique_origin_name}"
        uploads3Origin = await self.upload_fileobj(
            bucket=settings.S3_Bucket,
            key=key_origin,
            data=uploadFile.file._file,
            mimetype=uploadFile.content_type)
        if uploads3 and uploads3Origin:
            s3_url = f"/s3/{key}"
            s3_origin_url = f"/s3/{key_origin}"
            # response http to be used by the frontend
            return {
                "url": s3_url,
                "origin_url": s3_origin_url,
                "name": name,
                "type": "Image"
            }
        else:
            raise HTTPException(status_code=500,
                                detail="Failed to upload image to S3")

    async def upload_pdf(self, uploadFile: UploadFile):
        (filename, name) = await self.get_unique_filename(uploadFile.filename)
        key = f"{settings.S3_Key}{filename}"
        uploads3 = await self.upload_fileobj(bucket=settings.S3_Bucket,
                                             key=key,
                                             data=uploadFile.file._file,
                                             mimetype=uploadFile.content_type)
        if uploads3:
            s3_url = f"/s3/{key}"
            # response http to be used by the frontend
            return {"url": s3_url, "name": name, "type": "pdf"}
        else:
            raise HTTPException(status_code=500,
                                detail="Failed to upload pdf to S3")

    async def upload_file(self, uploadFile: UploadFile):
        # if mimetype is image upload image
        if uploadFile.content_type in image_mimetypes:
            return await self.upload_image(uploadFile)
        elif uploadFile.content_type in pdf_mimetypes:
            return await self.upload_pdf(uploadFile)
        else:
            raise HTTPException(
                status_code=500,
                detail="Could not match content-type despite header check")

    async def upload_fileobj(self, data: BytesIO, bucket: str, key: str,
                             mimetype: str):
        session = get_session()
        async with session.create_client(
                's3',
                region_name=self.region,
                endpoint_url="https://s3.epfl.ch",
                aws_secret_access_key=self.s3_secret_access_key,
                aws_access_key_id=self.s3_access_key_id) as client:
            file_upload_response = await client.put_object(
                Bucket=bucket,
                Key=key,
                Body=data,
                ACL="public-read",
                ContentType=mimetype)

            if file_upload_response["ResponseMetadata"][
                    "HTTPStatusCode"] == 200:
                logger.info(
                    f"File uploaded path : https://s3.epfl.ch/{bucket}/{key}")
                return True
        return False
