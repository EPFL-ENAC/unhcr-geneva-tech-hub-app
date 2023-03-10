.PHONY: backup-dump

install:
	npm install
	npx husky install
	$(MAKE) -C frontend install

run-frontend:
	$(MAKE) -C frontend run

run-database:
	docker-compose up --build -d couchdb

azure:
	$(MAKE) -C azure

setup-database:
	docker-compose up --build --force-recreate couchdb-setup

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

lint-staged:
	$(MAKE) -C frontend lint-staged


# setup and run when deploying on server
setup:
	echo "nothing to see here"

# https://docs.docker.com/storage/volumes/
# https://stackoverflow.com/questions/38298645/how-should-i-backup-restore-docker-named-volumes
# example on how to set ${DEST_FOLDER} <--  export DEST_FOLDER=$(pwd)
# you can always replace ${DEST_FOLDER} by $(pwd)
backup-dump:
	docker run --rm -v unhcr-geneva-tech-hub-app_couchdb_data:/opt/couchdb/data/ -v ${DEST_FOLDER}:/backup ubuntu tar cvf /backup/backup.tar /opt/couchdb/data/

backup-restore:
	docker run --rm --volume  unhcr-geneva-tech-hub-app_couchdb_data:/backup-extracted --volume ${DEST_FOLDER}:/backup ubuntu tar xvf /backup/backup.tar -C /backup-extracted --strip 1

run:
	docker-compose pull
	docker-compose build --parallel --no-cache
	docker-compose up -d --remove-orphans
	docker-compose restart couchdb
