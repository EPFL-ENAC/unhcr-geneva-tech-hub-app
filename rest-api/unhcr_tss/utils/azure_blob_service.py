import datetime
import os
import urllib
from io import BytesIO
from typing import Tuple
from PIL import Image
from fastapi import UploadFile
from azure.storage.blob.aio import BlobServiceClient
from azure.storage.blob import generate_blob_sas, BlobSasPermissions
from unhcr_tss.config import settings
from urllib.parse import unquote


class AzureBlobService:
    def __init__(self, account_name, account_key, container_name):
        self.account_name = account_name
        self.account_key = account_key
        self.container_name = container_name
        self.prefix = settings.AZURE_CONTAINER_PREFIX

        connection_string = f"DefaultEndpointsProtocol=https;AccountName={self.account_name};AccountKey={self.account_key};EndpointSuffix=core.windows.net"
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)


    async def convert_image(self, upload_file: UploadFile):
        request_object_content = await upload_file.read()
        origin_bytes_io = BytesIO(request_object_content)
        image = Image.open(origin_bytes_io)
        data = BytesIO()
        image.save(data, format="webp", quality=60)
        data.seek(0)
        origin_bytes_io.seek(0)
        return (data, origin_bytes_io)

    async def get_unique_filename(self, filename: str, ext: str = "") -> Tuple[str, str]:
        current_time = datetime.datetime.now()
        unique_name = str(current_time.timestamp()).replace('.', '')
        split_file_name = os.path.splitext(filename)
        ext = ext if ext != "" else split_file_name[1]
        name = split_file_name[0]
        uri_component_encoded = urllib.parse.quote(split_file_name[0])
        return (f"{unique_name}{uri_component_encoded}{ext}", name)

    async def upload_image(self, upload_file: UploadFile):
        (data, origin_data) = await self.convert_image(upload_file)
        (unique_name, name) = await self.get_unique_filename(upload_file.filename, ".webp")

        blob_name = f"{self.prefix.strip('/')}/{unique_name}"
        blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=blob_name)
        await blob_client.upload_blob(data, overwrite=True)

        (unique_origin_name, _) = await self.get_unique_filename(upload_file.filename)
        blob_origin_name = f"{self.prefix.strip('/')}/{unique_origin_name}"
        blob_client_origin = self.blob_service_client.get_blob_client(container=self.container_name, blob=blob_origin_name)
        await blob_client_origin.upload_blob(origin_data, overwrite=True)

        azure_url = f"{self.prefix}{unique_name}"
        azure_origin_url = f"{self.prefix}{unique_origin_name}"
        return {
            "url": urllib.parse.quote(azure_url),
            "origin_url": urllib.parse.quote(azure_origin_url),
            "name": name,
            "type": "Image"
        }

    async def upload_with_type(self, upload_file: UploadFile, type: str = "Other"):
        (filename, name) = await self.get_unique_filename(upload_file.filename)
        blob_name = f"{self.prefix.strip('/')}/{filename}"
        blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=blob_name)
        await blob_client.upload_blob(upload_file.file.read(), blob_type="BlockBlob", overwrite=True)
        azure_url = f"{self.prefix}{filename}"
        return {
            "url": urllib.parse.quote(azure_url),
            "name": name,
            "type": type
        }

    async def upload_file(self, upload_file: UploadFile):
        if upload_file.content_type.startswith("image/"):
            return await self.upload_image(upload_file)
        elif upload_file.content_type == "application/pdf":
            return await self.upload_with_type(upload_file, "Report")
        else:
            return await self.upload_with_type(upload_file, "Other")

    async def delete_file(self, file_path: str):
        normalized_blob_name = file_path.lstrip('/')
        decoded_blob_name = unquote(normalized_blob_name)
        blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=decoded_blob_name)
        await blob_client.delete_blob()
        return file_path

    def generate_file_url(self, blob_name: str, expiry_in_hours: int = 1) -> str:
        """
        Generate a URL for the given blob with an optional expiry time.

        Args:
            blob_name (str): The name of the blob.
            expiry_in_hours (int, optional): The expiry time in hours. Defaults to 1.

        Returns:
            str: The generated file URL.
        """
        sas_token = generate_blob_sas(
            account_name=self.account_name,
            container_name=self.container_name,
            blob_name=blob_name,
            account_key=self.account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.datetime.utcnow() + datetime.timedelta(hours=expiry_in_hours)
        )

        return f"https://{self.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}?{sas_token}"
