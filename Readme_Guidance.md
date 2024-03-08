# Maintenance plan for UNHCR-TSS Apps

## Descrption

The UNHCR TSS Apps comprise 2 tools : GHG Calculator & Shelter Sustainability. They operate independantly, and rely on different databases. 
[TODO: Expand intro text + Insert summary figure from Cara.]

The following document details it 
UNHCR Geneva Technical Hub App (TSS-APP)

## Contributors & maintainers
The tools have been conceived by [EPFL Essential Tech](https://www.essentialtech.ch/) and implemented by [EPFL ENAC-IT4R](https://www.epfl.ch/schools/enac/category/research/enac-it4research/) between 2022 and March 2024, with the codebase accessible at [https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/).

After March 2024, the tools will be fully integrated on UNHCR TIMS infrastructure, and maintained by [UNHCR](https://www.unhcr.org/) (domain expertise, product management) & [UNICC](https://www.unicc.org/) (technical maintenance.

[TODO: Contributors list?]

## Updating databases

[TODO : List of databases and update frequency - by Cara]

### Reference DB 
* The reference file is maintained by UNHCR and stored [here as an Excel](https://epflch.sharepoint.com/:x:/r/sites/ENAC-IT/Documents%20partages/Research%20IT/Advanced%20Services/0041%20%E2%80%93%20UNHCR/PHASE_2/GHG/DATABASES/GHG_EF_DBs_byModule.xlsx?d=w93e39ddb340758cfe3d57ae7412fc534&csf=1&web=1&e=mTGz8n)
[TODO: This Excel file should be migrated in UNHCR storage system.]
* Developers export each tab as CSVs in `reference-data/ghg/ghg_reference.csv` and run `make setup-reference` (for)
* Implementation details can be found : [implementation history](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/580) and [usage of datasets](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/blob/feat/dead-code-and-reference-data/frontend/src/assets/references/README.md)

### UNHCR locations
* The reference file is maintained by UNHCR and stored [here as an Excel]([https://epflch.sharepoint.com/:x:/r/sites/ENAC-IT/Documents%20partages/Research%20IT/Advanced%20Services/0041%20%E2%80%93%20UNHCR/PHASE_2/GHG/DATABASES/GHG_EF_DBs_byModule.xlsx?d=w93e39ddb340758cfe3d57ae7412fc534&csf=1&web=1&e=mTGz8n](https://docs.google.com/spreadsheets/d/1VVxsSS-KCUmP-giKZwlARNmw5RSSZHUQ/edit#gid=1437641817))
[TODO: This Excel file should be migrated in UNHCR storage system.]
* Developers create `/frontend/src/assets/references/unhcr_location.json` with the `reference-data/Makefile`
[TODO: This might need details Pierre?]
* Implementation details can be found (reference issues  https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/438 & https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/467
[TODO: Pierre, is this really necessary ?]

### Other DBs
[TODO]

## Users & Roles

### Roles definition
[TODO]

### Adding a user (with AZURE AD)
[TODO]

### How to make a user admin user (from AZURE AD)
* UNHCR users may request admin right to UNICC, providing [TODO: What do they need to provide? Or make a new project,right? To Double check]
* Developers must list Azure admins in these 3 files :
  - `couchdb-setup/bootstrap/ghg_projects_1696578512055758/_design/project/validate_doc_update.js`
  - `couchdb-setup/bootstrap/shelter_projects_1698666594213623/_design/shelter/validate_doc_update.js`
  - `frontend/src/plugins/user.ts`
* Specifically, in those files the function `checkIfAdmin` contains a `unhcrAdmins` array.
This array contains a list of string, each string correspond to the unique id (sub field) of the user in entra/Azure, which is the subject unique id.

```
  export function checkIfAdmin(user: CouchUser) {
  // either we have the role 'admin' or '_admin'
  // or we are in a custom list of unhcr users sub
  const unhcrAdmins = [
    "TBxz7Wb3aSrQGeFx1EbBtrtaKPht-4M87pznkWC2BYE" // nimri sub
  ];
```

### Custom user management on EPFL-side
[TODO: For reference - mettre ici Pierre?]


## Deployment

-- below is yet to be re-organized



## s3 files necessary for the frontend
Before any uploads from the users you need some files (pdfs,videos, images, etc) for the frontend
- it will populate the s3 with a tar.gz file
- by running `make setup-data` at the root level

### How to updates documents and pdfs, vidéos

- find the files in the s3 server and updates them

## CouchDB setup:
We need to run the couchdb-bootstrap to setup the databases and users, once.
- It's only necessary if you start the project with a new database with no documents
- by running `make setup-database` at the root level

### CouchDB authentication
- more information on the [README](couchdb-setup/README.md)

## Development

- We use husky for git hooks: https://typicode.github.io/husky/#/?id=install
- We use standard version and commitlint for automatic release log and proper commit message


### CI/CD
- We use the following workflows
  - release-please to trigger tags and changelogs also releases (on push to main)
  - deploy-test that builds the images and push them to the ghcr registry then deploy them to unhcr-tss-test.epfl.ch for every push to the 'dev' branch
  - deploy-prod that builds the images and push them to the ghcr registry then deploy them to unhcr-tss.epfl.ch for every 'release created by release-please'

### Prerequisites

- [Make](https://www.gnu.org/software/make/) (gnu make)
- [Node.js](https://nodejs.org/) 16.x
  - use nvm https://github.com/nvm-sh/nvm#installing-and-updating
  - nvm install lts/gallium; nvm use lts/gallium
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

# setup the database if changes are made locally (change couchdb bootstrap files et c)
make setup-database;
# donwload files to upload to local minio service (pdfs and videos mainly)
make setup-data;
# regenerate reference json files from csv in case changes are made locally
make setup-reference;
# run the dev server for the frontend on port 8080
make run-frontend;
# http://127.0.0.1:8080

```
- have a look at [frontend readme](frontend/README.md)

#### Visual Studio Code

Run configurations are in `.vscode`: https://code.visualstudio.com/docs/editor/debugging

## Deployment

### Local build with Docker Compose

```bash
make run-local # will build with docker-compose and run docker-compose up -d with ghcr.io built images
```

### prod and dev on docker file
- We use an override for the configuration to avoid rebuilding the images

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
curl -X PUT http://localhost:5984/_users/org.couchdb.user:newuser@epfl.ch \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "newuser@epfl.ch", "password": "plain_text_password_that_will_be_encrypted", "roles": [], "type": "user"}'
```
2. retrieve the inserted documented
```
 curl -X GET http://admin:couchdb@localhost:5984/_users/org.couchdb.user:newuser@epfl.ch \
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
- run the following
```bash
make azure
```
- it will update the couchdb/local.ini configuration under jwt_keys

## File uploads used by the shelter app and custom user registration
- 2 services (docker compose) necessary
  - (s3_server) nginx proxy to our minio s3 instance (cf docker-compose file in [minio doc](./minio/README.md)
  - (rest-api)  python fast api
    - use boto3 to upload files to the s3 instance
    - use custom user management system for couchdb user creation and registering new users (also send email and password verification)

We don't store the uploaded file directly to a database, it should be done by the frontend by talking directly to couchdb. The API just return the path served by the nginx reverse proxy

