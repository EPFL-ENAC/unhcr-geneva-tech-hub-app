from aiobotocore.session import get_session
from io import BytesIO
from fastapi.logger import logger
import datetime
from PIL import Image
from fastapi.exceptions import HTTPException
from unhcr_tss.config import settings
from fastapi.datastructures import UploadFile
import os


class S3_SERVICE(object):

    def __init__(self, s3_access_key_id, s3_secret_access_key, region, *args,
                 **kwargs):
        self.s3_access_key_id = s3_access_key_id
        self.s3_secret_access_key = s3_secret_access_key
        self.region = region

    async def upload_file(self, uploadFile: UploadFile):
        current_time = datetime.datetime.now()
        # generate unique name for the file
        unique_name = str(current_time.timestamp()).replace('.', '')
        # file extention
        extension = ".webp"

        request_object_content = await uploadFile.read()
        image = Image.open(BytesIO(request_object_content))
        data = BytesIO()
        image.save(data, format="webp", quality=60)
        mimetype = "image/webp"

        filename = uploadFile.filename
        split_file_name = os.path.splitext(filename)
        image_name = split_file_name[0]


        key = f"{settings.S3_Key}{unique_name}{image_name}{extension}"
        uploads3 = await self.upload_fileobj(bucket=settings.S3_Bucket,
                                                  key=key,
                                                  data=data.getvalue(),
                                                  mimetype=mimetype)
        if uploads3:
            s3_url = f"/s3/{key}"
            # response http to be used by the frontend
            return {
                "url": s3_url,
                "name": image_name,
                "type": "Image"
            }
        else:
            raise HTTPException(status_code=500,
                                detail="Failed to upload to S3")

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
