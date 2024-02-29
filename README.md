# unhcr-geneva-tech-hub-app

UNHCR Geneva Technical Hub App

## Status
Currently under development, final release expected for end of March 2024.

## Update references variable and UNHCR locations
- Follow this CF [Data ref](couchdb-setup/rawdata/README.md)
- And then you may run `make setup-reference`

## Development

- We use husky for git hooks: https://typicode.github.io/husky/#/?id=install
- We use standard version and commitlint for automatic release log and proper commit message

## CI/CD
- We use the following workflows
  - release-please to trigger tags and changelogs also releases (on push to main)
  - deploy-test that builds the images and push them to the ghcr registry then deploy them to unhcr-tss-test.epfl.ch for every push to the 'dev' branch
  - deploy-prod that builds the images and push them to the ghcr registry then deploy them to unhcr-tss.epfl.ch for every 'release created by release-please'

### Prerequisites

Prerequisites:

- [Make](https://www.gnu.org/software/make/) (gnu make)
- [Node.js](https://nodejs.org/) 16.x
  - use nvm https://github.com/nvm-sh/nvm#installing-and-updating
  - nvm install --lts; nvm use --lts
- [yarn]
- [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/) 1.27.0+

### Run for development using docker compose

#### information about 127.0.0.11 as the static docker dns ip
From: https://hwchiu.medium.com/fun-dns-facts-learned-from-the-kind-environment-241e0ea8c6d4
Readers familiar with Docker Compose are likely aware that for convenient communication between containers, container names can be used directly as DNS targets. This design eliminates the need for containers to worry about IP changes. Docker, in fact, embeds a DNS server within its system to handle this issue, with the DNS server’s fixed IP being 127.0.0.11.

The responsibilities of this DNS server can be categorized as follows:

If the DNS request is for a container name, the IP of the container is returned.
Otherwise, based on the host configuration, the DNS request is forwarded to an upstream DNS server.
In the example depicted below, two containers, named “hwchiu” and “hwchiu2,” are running. Using nslookup, one can easily resolve the corresponding IP addresses. It’s also observable that the /etc/hosts file within these containers dynamically point to 127.0.0.11. This implies that all DNS requests within the containers are redirected to the built-in Docker DNS server.

#### Create .env file to hold your Secrets

We use two env files `./.env` and `./frontend/.env`
Create the files by running `make env-file`

- ./.env
  is used by every service
- ./frontend/.env
  is used by the frontend

#### Installation

```bash
make install
```

#### CLI

```bash
# to run all the docker compose services
make run-local


# to run only some services
make run-database;
# setup the database if changes are made locally (change files et c)
make setup-database;
# donwload files to upload to local minio service (pdfs and videos mainly)
make setup-data;
# regenerate reference json files from csv in case changes are made locally
make setup-reference;
# run the dev server for the frontend on port 8080
make run-frontend;
# http://127.0.0.1:8080
```

#### Visual Studio Code

Run configurations are in `.vscode`: https://code.visualstudio.com/docs/editor/debugging

## Deployment

### Local build with Docker Compose

```bash
make run # will build with docker-compose and run docker-compose up -d with ghcr.io built images
```

### Server @EPFL
We use enacit-ansible to automate our process with the CD service

### Deployment process

* regular (at least weekly) releases onto the staging environment - http://unhcr-tss-test.epfl.ch/ accessible within EPFL only.
* monthly (by the 1st) releases onto the production environment  http://unhcr-tss.epfl.ch/ including only features validated.
* intermediate releases may happen occasionally for hot fixes 

Releases number follow [semantic versioning conventions](https://semver.org/\). 

## Create a new user
There is two way of doing this: first one using curl; second one using couchdb-bootstrap

### Using curl
1. Follow: https://docs.couchdb.org/en/stable/intro/security.html#creating-a-new-user
```
curl -X PUT http://admin:couchdb@localhost/db/_users/org.couchdb.user:newuser@epfl.ch \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "newuser@epfl.ch", "password": "plain_text_password_that_will_be_encrypted", "roles": [], "type": "user"}'
```
2. retrieve the inserted documented
```
 curl -X GET http://admin:couchdb@localhost/db/_users/org.couchdb.user:newuser@epfl.ch \
     -H "Accept: application/json" \
     -H "Content-Type: application/json"

{"_id":"org.couchdb.user:newuser@epfl.ch","_rev":"1-xxxx","name":"newuser@epfl.ch","roles":[],"type":"user","password_scheme":"pbkdf2","iterations":10,"derived_key":"917a923abd865bc82feadd5659a1d0d55318ca49","salt":"83f9a989d48e31b7a5e99c28df8a989c"}
```
3. add the result json from above inside
add the above json result as new file in `couchdb-setup/bootstrap/_users/newuser@epfl.ch.json` :
3.a you can remove the _rev field

```json
{
  "_id": "org.couchdb.user:newuser@epfl.ch",
  "name": "newuser@epfl.ch",
  "roles": [],
  "type": "user",
  "password_scheme": "pbkdf2",
  "iterations": 10,
  "derived_key": "917a923abd865bc82feadd5659a1d0d55318ca49",
  "salt": "83f9a989d48e31b7a5e99c28df8a989c"
}
```

### Using couchdb bootstrap
- add a new file inside couchdb-setup/bootstrap/_users with
```json
{
  "_id": "org.couchdb.user:newuser@epfl.ch",
  "name": "newuser@epfl.ch",
  "roles": [],
  "type": "user",
  "password": "plain_text_that_will_be_hash_by_couchdb",
}
```
*BEWARE*:  this change should not be commited to github since the password is not encrypted
- run the following command:

```bash
make setup-database
```

- CouchDB has hashed the password, you can get it on http://localhost:5984/\_utils/#database/\_users/\_all_docs
- find the new user and download
- save the document by deplacing `couchdb-setup/bootstrap/_users/new_username.json`
- remove the `'_rev'` field and commit the file

## Update public keys for unhcr azure server (change may happen)
- run make azure
```bash
make azure
```
- then copy the content of the json `azure/jwt_keys.json` at the proper place inside couchdb-setup/bootstrap/_config.json
- verify that the json is valid

## file uploads
- 2 services (docker compose) necessary
  - (s3_server) nginx proxy to our minio s3 instance (cf docker-compose file in [minio doc](./minio/README.md)
  - (rest-api)  python fast api
    - use boto3 to upload files to the s3 instance
    - use custom user management system for couchdb user creation and registering new users (also send email and password verification)

We don't store the uploaded file directly to a database, it should be done by the frontend by talking directly to couchdb. The API just return the path served by the nginx reverse proxy


## Collaborators

[EPFL Essential Tech Center](https://www.essentialtech.ch/)
[ENAC FAR](https://www.epfl.ch/labs/far/)
[ENAC-IT4R](http://enac-it4r.epfl.ch/)


## Registration process

/register
/confirm
/unconfirm

/forgot password --> forgot password form
/change-password --> change password form (keep history of password)
