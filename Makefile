install:
	npm install
	npx husky install
	$(MAKE) -C frontend install
	$(MAKE) -C couchdb install

run-frontend:
	$(MAKE) -C frontend run

run-database:
	docker-compose up -d couchdb

test:
	$(MAKE) -C backend test
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C backend lint
	$(MAKE) -C frontend lint

setup:
	echo "nothing to setup for server"

run:
	docker-compose build --pull
	docker-compose up --remove-orphans
