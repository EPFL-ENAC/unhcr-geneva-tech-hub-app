import os
import datetime
from io import BytesIO
from typing import Tuple
from PIL import Image
from fastapi import HTTPException, UploadFile
from azure.storage.blob.aio import BlobServiceClient, BlobClient
import urllib

class AzureBlobService:
    def __init__(self, account_name, account_key, container_name):
        self.account_name = account_name
        self.account_key = account_key
        self.container_name = container_name
        self.prefix = "/azure/"

        # Costruzione della stringa di connessione
        connection_string = f"DefaultEndpointsProtocol=https;AccountName={self.account_name};AccountKey={self.account_key};EndpointSuffix=core.windows.net"
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)


    async def convert_image(self, uploadFile: UploadFile):
        request_object_content = await uploadFile.read()
        origin_BytesIo = BytesIO(request_object_content)
        image = Image.open(origin_BytesIo)
        data = BytesIO()
        image.save(data, format="webp", quality=60)
        data.seek(0)  # Important: reset pointer to the beginning of the BytesIO object
        origin_BytesIo.seek(0)
        return (data, origin_BytesIo)

    async def get_unique_filename(self, filename: str, ext: str = "") -> Tuple[str, str]:
        current_time = datetime.datetime.now()
        unique_name = str(current_time.timestamp()).replace('.', '')
        split_file_name = os.path.splitext(filename)
        ext = ext if ext != "" else split_file_name[1]
        name = split_file_name[0]
        uri_component_encoded = urllib.parse.quote(split_file_name[0])
        return (f"{unique_name}{uri_component_encoded}{ext}", name)

    async def upload_image(self, uploadFile: UploadFile):
        (data, origin_data) = await self.convert_image(uploadFile)
        (unique_name, name) = await self.get_unique_filename(uploadFile.filename, ".webp")

        blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=unique_name)
        await blob_client.upload_blob(data, blob_type="BlockBlob", overwrite=True)

        (unique_origin_name, _) = await self.get_unique_filename(uploadFile.filename)
        blob_client_origin = self.blob_service_client.get_blob_client(container=self.container_name, blob=unique_origin_name)
        await blob_client_origin.upload_blob(origin_data, blob_type="BlockBlob", overwrite=True)

        azure_url = f"{self.prefix}{unique_name}"
        azure_origin_url = f"{self.prefix}{unique_origin_name}"
        return {
            "url": urllib.parse.quote(azure_url),
            "origin_url": urllib.parse.quote(azure_origin_url),
            "name": name,
            "type": "Image"
        }

    async def upload_with_type(self, uploadFile: UploadFile, type: str = "Other"):
        (filename, name) = await self.get_unique_filename(uploadFile.filename)
        blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=filename)
        await blob_client.upload_blob(uploadFile.file.read(), blob_type="BlockBlob", overwrite=True)
        azure_url = f"{self.prefix}{filename}"
        return {
            "url": urllib.parse.quote(azure_url),
            "name": name,
            "type": type
        }

    async def upload_file(self, uploadFile: UploadFile):
        # Determina il tipo del file e procedi con l'upload appropriato
        if uploadFile.content_type.startswith("image/"):
            # Se il file è un'immagine, utilizza il metodo upload_image
            return await self.upload_image(uploadFile)
        elif uploadFile.content_type == "application/pdf":
            # Per i file PDF, puoi chiamare upload_with_type con "Report" o un'altra logica specifica
            return await self.upload_with_type(uploadFile, "Report")
        else:
            # Per tutti gli altri tipi di file, usa il metodo generico upload_with_type
            return await self.upload_with_type(uploadFile, "Other")

    async def delete_file(self, filePath: str):
        blob_client = self.blob_service_client.get_blob_client(container=self.container_name, blob=filePath.removeprefix(self.prefix))
        await blob_client.delete_blob()
        return filePath
