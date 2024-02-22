.PHONY: backup-dump install run-frontend run-database azure setup-database setup-data setup-reference test lint lint-staged dump-prod-to-local restore-local-to-test restore-local setup run run-local run-dev
# Get the current HEAD tag
TAG := $(shell git describe --tags --abbrev=0)

# Set the IMAGE_VERSION environment variable
export IMAGE_VERSION := $(TAG)

# Define the default target
.DEFAULT_GOAL := deploy

install:
	npm install
	npx husky install
	$(MAKE) -C frontend install
	$(MAKE) -C rest-api install

run-frontend:
	$(MAKE) -C frontend run

run-database:
	docker compose up --build -d couchdb

azure:
	$(MAKE) -C azure

setup-database:
	docker compose up --build --force-recreate --no-deps couchdb-setup

setup-data:
	docker compose up --build --force-recreate --no-deps data-setup

setup-reference:
	$(MAKE) -C couchdb-setup/rawdata

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

lint-staged:
	$(MAKE) -C frontend lint-staged


# https://docs.docker.com/storage/volumes/
# https://stackoverflow.com/questions/38298645/how-should-i-backup-restore-docker-named-volumes
# example on how to set ${DEST_FOLDER} <--  export DEST_FOLDER=$(pwd)
# you can always replace ${DEST_FOLDER} by $(pwd)
dump-prod-to-local:
	rsync -avH --delete --force root@unhcr-tss.epfl.ch:/var/lib/docker/volumes/unhcr-tss_couchdb_data/ unhcr-tss_couchdb_data_docker_volume/

restore-local-to-test:
	rsync -avH --delete --force unhcr-tss_couchdb_data_docker_volume/ root@unhcr-tss-test.epfl.ch:/var/lib/docker/volumes/unhcr-tss_couchdb_data/

restore-local:
	docker run --rm -v $PWD:/source -v unhcr-geneva-tech-hub-app_couchdb_data:/opt/couchdb/data/ -w /source alpine cp -rf  unhcr-tss_couchdb_data_docker_volume/_data/* /opt/couchdb/data/


# setup and run when deploying on server
setup:
	echo "nothing to see here"

run:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --pull=always -d --remove-orphans

run-dev:
	$(MAKE) run-frontend &
	docker compose -f docker-compose.yml up --pull=always -d --remove-orphans

stop-dev:
	/usr/bin/bash ./stopDevFrontend.sh &
	docker-compose -f docker-compose.yml down