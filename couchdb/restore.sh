#!/usr/bin/env bash

# after buttin the backup.tar.gz and backup-config.tar.gz in /tmp we can run the script below to restore the backup

# docker compose stop couchdb
# the data
cd /opt/unhcr-tss ; \
docker compose stop couchdb ; \
rm -rf /tmp/etc; mkdir -p /tmp/backup-config ; tar -xvf /tmp/backup-config.tar.gz  -C /tmp/etc/ ; \
rm -rf /tmp/data; mkdir -p /tmp/data ; tar -xvf /tmp/backup.tar.gz  -C /tmp/data/ ; \
docker compose cp -a  /tmp/data couchdb:/opt/couchdb/ ; \
docker compose cp -a  /tmp/etc couchdb:/opt/couchdb/ ; \
docker compose up -d couchdb


# docker compose run couchdb ls -lah /opt/couchdb/data