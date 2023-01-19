# FastAPI
Based loosely on https://github.com/gauravgola96/FastAPI-Example

API for uploading object(.png) to S3 bucket asynchronously

Create a file .env and put all s3 credential here
```
.env
```
s3 credentials 

```
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION = 
S3_Bucket = 
S3_Key = 

```


Run Locally
```
python api.py
```

Swagger docs
```
http://0.0.0.0:5050/docs
```

To provide .env use Dockerfile.
```
Path : ./Dockerfile
```

## Install
Don't forget to install libwebp-dev on the machine
