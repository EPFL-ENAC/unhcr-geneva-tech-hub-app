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

# setup and run when deploying on server
setup:
	docker-compose build --parallel --pull
run:
	docker-compose up -d --remove-orphans
	docker-compose run couchdb-setup make