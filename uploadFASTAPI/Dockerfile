FROM python:3.10.9-alpine as build-stage
WORKDIR /app
RUN apk add --no-cache \
    g++ \
    gcc \
    musl-dev \
    libc-dev \
    libffi-dev
RUN pip install poetry
COPY ./pyproject.toml ./poetry.lock* /app/
RUN poetry export --output requirements.txt


FROM python:3.10.9-alpine as production-stage
LABEL maintainer="<pierre.guilbert@epfl.ch>"
LABEL description="FastAPI upload via boto3"

ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
EXPOSE 5050
WORKDIR /app
RUN apk add --no-cache \
    g++ \
    gcc \
    musl-dev \
    ca-certificates \
    ffmpeg \
    libwebp \
    libwebp-tools

COPY --from=build-stage /app/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

COPY ./pyproject.toml ./README.md /app/
COPY ./unhcr_tss /app/unhcr_tss

RUN pip install --no-cache-dir .

CMD [ "uvicorn", "unhcr_tss.main:app", "--host", "0.0.0.0", "--port", "5050" ]