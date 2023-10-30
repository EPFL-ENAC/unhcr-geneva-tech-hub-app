FROM alpine:latest
LABEL org.opencontainers.image.authors="d3fk"
LABEL org.opencontainers.image.source="https://github.com/Angatar/s3cmd.git"
LABEL org.opencontainers.image.url="https://github.com/Angatar/s3cmd"

RUN apk upgrade --no-cache \
  && apk add --no-cache python3 py3-six py3-pip py3-setuptools libmagic git ca-certificates wget\
  && git clone https://github.com/s3tools/s3cmd.git /tmp/s3cmd \
  && cd /tmp/s3cmd \
  && pip install python-dateutil python-magic \
  && python3 /tmp/s3cmd/setup.py install \
  && cd / \
  && apk del py3-pip git \
  && rm -rf /root/.cache/pip /tmp/s3cmd 

WORKDIR /opt

ADD ./s3cfg /opt/.s3cfg
ADD ./main.sh /opt/main.sh
ADD ./script.sh /opt/script.sh

# Main entrypoint script
RUN chmod 777 /opt/main.sh
RUN chmod 777 /opt/script.sh

# Folders for s3cmd optionations
RUN mkdir /opt/src
RUN mkdir /opt/dest

WORKDIR /
CMD ["/bin/sh", "-c", "/opt/script.sh; ls -lah /opt/src; ls -l /opt; /opt/main.sh"]