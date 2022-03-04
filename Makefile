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
	echo "nothing to see here"

run:
	docker-compose build --parallel --pull
	docker-compose up -d --remove-orphans