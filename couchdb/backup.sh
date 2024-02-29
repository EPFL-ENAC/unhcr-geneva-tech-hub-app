#!/usr/bin/env bash

# However, you can also copy the actual .couch files from the CouchDB data directory (by default, data/) 
# at any time, without problem. CouchDB’s append-only storage format for both databases and secondary indexes 
# ensures that this will work without issue.

# To ensure reliability of backups, it is recommended that you back up secondary indexes (stored under data/.shards) 
# prior to backing up the main database files (stored under data/shards as well as the system-level databases at the parent data/ 
# directory). This is because CouchDB will automatically handle views/secondary indexes that are slightly out of date by updating 
# them on the next read access, but views or secondary indexes that are newer than their associated databases will trigger a full 
# rebuild of the index. This can be a very costly and time-consuming operation, and can impact your ability to recover quickly in 
# a disaster situation.

# use to be 
# # https://docs.docker.com/storage/volumes/
# # https://stackoverflow.com/questions/38298645/how-should-i-backup-restore-docker-named-volumes
# # example on how to set ${DEST_FOLDER} <--  export DEST_FOLDER=$(pwd)
# # you can always replace ${DEST_FOLDER} by $(pwd)
# backup-dump:
#        docker run --rm -v unhcr-geneva-tech-hub-app_couchdb_data:/opt/couchdb/data/ -v ${DEST_FOLDER}:/backup ubuntu tar cvf /backup/backup.tar /opt/couchdb/data/
# 
# backup-restore:
#        docker run --rm --volume  unhcr-geneva-tech-hub-app_couchdb_data:/backup-extracted --volume ${DEST_FOLDER}:/backup ubuntu tar xvf /backup/backup.tar -C /backup-extracted --strip 1
# 

# PRIOR: connect to server and go to /opt/unhcr-tss 

# export couchdb-export
rm -rf /tmp/couchdb-export
mkdir -p /tmp/couchdb-export
docker-compose cp couchdb:/opt/couchdb/data/.shards /tmp/couchdb-export/.shards
docker-compose cp couchdb:/opt/couchdb/data/shards /tmp/couchdb-export/shards
docker-compose cp couchdb:/opt/couchdb/data/_nodes.couch /tmp/couchdb-export/_nodes.couch
docker-compose cp couchdb:/opt/couchdb/data/_dbs.couch /tmp/couchdb-export/_dbs.couch
docker-compose cp couchdb:/opt/couchdb/data/.delete /tmp/couchdb-export/.delete

tar czvf /tmp/backup.tar.gz -C /tmp/couchdb-export/ .

# export configuration

rm -rf /tmp/couchdb-export-config
mkdir -p /tmp/couchdb-export-config
docker-compose cp couchdb:/opt/couchdb/etc/ /tmp/couchdb-export-config/

tar czvf /tmp/backup-config.tar.gz -C /tmp/couchdb-export-config/ .


# then you can retrieve on your machine

scp unhcr-tss.epfl.ch:/tmp/backup.tar.gz backup.tar.gz
scp unhcr-tss.epfl.ch:/tmp/backup-config.tar.gz backup-config.tar.gz

# then you can upload to the new server

scp backup* unhcr-tss-test.epfl.ch:/tmp
