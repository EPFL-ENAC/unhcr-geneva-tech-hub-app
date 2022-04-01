install:
	npm install
	npx husky install
	$(MAKE) -C frontend install

run-frontend:
	$(MAKE) -C frontend run

run-database:
	docker-compose up -d couchdb

setup-database:
	docker-compose up --build --force-recreate couchdb-setup

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

# setup and run when deploying on server
setup:
	echo "nothing to see here"

run:
	docker-compose build --parallel --pull
	docker-compose up -d --remove-orphans
