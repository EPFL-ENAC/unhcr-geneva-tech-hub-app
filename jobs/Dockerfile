FROM jupyter/scipy-notebook:python-3.11.4

USER root

WORKDIR /home/jovyan/work

ENV PYTHONPATH "${PYTHONPATH}:/home/jovyan/work"

COPY . /home/jovyan/work

COPY requirements.txt /tmp/

RUN apt-get update -y && \
    apt-get install -y gcc build-essential libpq-dev && \
    pip install --no-cache-dir -r /tmp/requirements.txt

RUN rm -rf /home/jovyan/.cache/pip/*

ENTRYPOINT ["python", "main.py"]