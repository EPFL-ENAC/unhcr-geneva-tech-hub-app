.PHONY: backup-dump env-file install run-frontend run-database azure setup-database setup-data setup-reference test lint lint-staged dump-prod-to-local restore-local-to-test restore-local setup run run-local run-dev docker-build-push eks-init create-namespace eks-setup-secrets eks-setup-chart get-grafana-password install-chart

# Get the current HEAD tag
TAG := $(shell git describe --tags --abbrev=0)

# Set the IMAGE_VERSION environment variable
export IMAGE_VERSION := $(TAG)

# Define the default target
.DEFAULT_GOAL := deploy

install: env-file
	npm install
	npx husky install
	$(MAKE) -C frontend install
	$(MAKE) -C rest-api install

env-file:
	cp .env.example .env
	cp frontend/.env.example frontend/.env

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

run-local:
	docker compose up -d --remove-orphans

run-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --pull=always -d --remove-orphans


install-chart:
#	helm registry login registry-1.docker.io/bitnamicharts
	helm dependency update ./tss
	helm dependency build ./tss
	helm install tss ./tss

# Import environment variables from the .env file
include .env
include frontend/.env
export

# Definition of the HELM_SET_FLAGS variable
define HELM_SET_FLAGS
--set global.__common__.grafana.enabled=${GRAFANA_ENABLED} \
--set global.__common__.grafana.host=${GRAFANA_HOST} \
--set global.__common__.image.registry=${REGISTRY} \
--set global.__common__.image.repository=${REPOSITORY} \
--set global.__common__.image.tag=${TAG} \
--set global.__common__.ingress.host=${HOST} \
--set global.__common__.ingress.tls.hosts[0]=${HOST} \
--set global.clusterissuer.email=${EMAIL} \
--set global.clusterissuer.name=${ISSUER_NAME} \
--set global.configmap.data.DOMAIN=${HOST} \
--set global.configmap.data.SITE_NAME=${HOST}
endef

# Command to create the namespace if it does not exist
create-namespace:
	@echo "Ensuring namespace '${NAMESPACE}' exists..."
	@if ! kubectl get namespace ${NAMESPACE}; then \
		echo "Namespace '${NAMESPACE}' not found. Creating..."; \
		kubectl create namespace ${NAMESPACE}; \
	else \
		echo "Namespace '${NAMESPACE}' already exists."; \
	fi

# Command to configure the secrets in the EKS cluster
eks-setup-secrets: create-namespace
	@echo "Configuring secrets in namespace '${NAMESPACE}'..."
	@kubectl create secret generic app-secret \
		--namespace=${NAMESPACE} \
		--from-literal=COUCHDB_USER=${COUCHDB_USER} \
		--from-literal=COUCHDB_PASSWORD=${COUCHDB_PASSWORD} \
		--from-literal=COUCHDB_HOST=${COUCHDB_HOST} \
		--dry-run=client -o yaml | kubectl apply -f -

# Command to configure the secrets in the EKS cluster
eks-setup-configmap: create-namespace
	@echo "Configuring secrets in namespace '${NAMESPACE}'..."
	@kubectl create configmap app-configmap \
		--namespace=${NAMESPACE} \
		--from-literal=COUCHDB_HOST=${COUCHDB_HOST} \
		--dry-run=client -o yaml | kubectl apply -f -


# Command to configure the main Helm chart in the EKS cluster
eks-setup-chart: create-namespace eks-setup-secrets eks-setup-configmap
	@echo "Setting up Helm chart in namespace '${NAMESPACE}'..."
	@cd helm/__main__ && helm dependency update
	@echo "Installing or upgrading Helm chart '${CHART}'..."
	@if ! helm list --namespace ${NAMESPACE} | grep -q ${CHART}; then \
		echo "Installing Helm chart '${CHART}'..."; \
		cd helm && helm install ${CHART} ./__main__ --namespace ${NAMESPACE} $(HELM_SET_FLAGS); \
	else \
		echo "Chart '${CHART}' is already installed. Upgrading..."; \
		cd helm && helm upgrade ${CHART} ./__main__ --namespace ${NAMESPACE} $(HELM_SET_FLAGS); \
	fi


# Command to remove the main Helm chart from the EKS cluster
eks-remove-chart:
	@echo "Removing Helm chart '${CHART}' from namespace '${NAMESPACE}'..."
	@helm uninstall ${CHART} --namespace ${NAMESPACE}
	@echo "Helm chart '${CHART}' has been removed from namespace '${NAMESPACE}'."

#	@helm uninstall loki -n loki
#	@helm uninstall promtail -n loki
#	@helm uninstall prometheus -n prometheus
