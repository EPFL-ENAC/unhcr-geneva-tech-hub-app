install:
	yarn install
	yarn husky install
	npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
	$(MAKE) -C frontend install

run-frontend:
	$(MAKE) -C frontend run

test:
	$(MAKE) -C frontend test

lint:
	$(MAKE) -C frontend lint

setup:
	echo "nothing to setup for server"

run:
	docker-compose build --pull
	docker-compose up --remove-orphans
