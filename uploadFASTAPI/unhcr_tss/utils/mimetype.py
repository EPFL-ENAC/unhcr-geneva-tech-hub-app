from fastapi.exceptions import HTTPException
from fastapi.datastructures import UploadFile

# verify extension/content-type is valid
pdf_mimetypes = [
    "application/acrobat", "application/pdf", "application/x-pdf", "text/pdf",
    "text/x-pdf"
]
png_mimetypes = ["image/png", "application/png", "application/x-png"]
jpg_mimetypes = [
    "image/jpg", "application/jpg", "application/x-jpg", "image/jpeg",
    "application/jpeg"
]
gif_mimetypes = ["image/gif"]
other_image_mimetypes = ["image/bmp", "image/webp"]
image_mimetypes = png_mimetypes + jpg_mimetypes + gif_mimetypes + other_image_mimetypes
valid_mimetypes = image_mimetypes + pdf_mimetypes


async def mimetype_checker(files: list[UploadFile]):
    for file in files:
        if file.content_type not in valid_mimetypes:
            detail = f"Invalid file type: {file.content_type} from {file.filename}"
            raise HTTPException(400, detail=detail)
    return files
