# README & Maintenance plan for UNHCR-TSS Apps
_Last update: March 2024_

## Description
The UNHCR TSS Apps comprise 2 tools : GHG Calculator & Shelter Sustainability.
They operate independantly, and rely on different databases (see [Updating contents](#updating-contents-csvs-databases-etc))

## Contributors & maintainers
The tools have been conceived by [EPFL Essential Tech](https://www.essentialtech.ch/) and implemented by [EPFL ENAC-IT4R](https://www.epfl.ch/schools/enac/category/research/enac-it4research/) between 2022 and March 2024, with the codebase accessible at [https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/).

After March 2024, the tools will be fully integrated on UNHCR TIMS infrastructure, and maintained by [UNHCR](https://www.unhcr.org/) (domain expertise, product management) & [UNICC](https://www.unicc.org/) (technical maintenance).

## Updating contents (CSVs databases etc)

```mermaid
---
title: The TSS Tools' Reference Data
---
flowchart TD
    AB[(Grid emission factors)]:::ToUpgrade --> A
    AC[(Emission Factors)]:::Databases --> A
    AD[(Default Values)]:::ToUpgrade --> A
    AE[(UNHCR Locations)]:::Databases --> A
    AF[(GHG fNRB)]:::Databases --> A
    BA[(Materials)]:::Databases --> B
    BB[(Materials transport)]:::Databases --> B

    A(GHG Calculator):::App
    B(Shelter Sustainability):::App

classDef ToUpgrade stroke:#000,stroke-width:1px,fill:#ffb3b3,color:black,font-size:20px
classDef Databases stroke:#000,stroke-width:1px,fill:#dfdffc,color:black,font-size:20px
classDef App stroke:#000,stroke-width:1px,fill:#c1fbc1,color:black,font-size:30px,padding:10px
```

TODO: Cara Reference Data table with update frequencies

### Datasets

| Tool               | Database       | Description  | CSV file path                                 | JSON file path             | Used By |
|------------------------|----------------------|-|-------------------------------------------------------|-|---------|
| GHG Calculator         | Grid Emission Factors| | `reference-data/ghg/grid_emission_factors.csv`         | `frontend/src/assets/references/grid_emission_factors.json`| `frontend/src/store/GhgModule.ts via frontend/src/store/GhgReferenceGridModule.ts` |
| GHG Calculator         | Emission Factors     | | `reference-data/ghg/ghg_reference.csv`                 | `frontend/src/assets/references/ghg_reference.json`| `frontend/src/store/GhgReferenceModule.ts` |
| GHG Calculator         | Emission Factors     | | `reference-data/ghg/ghg_ef_mixed_biowaste_list.csv`    | `frontend/src/assets/references/ghg_ef_mixed_biowaste_list.json`,`frontend/src/assets/references/ghg_ef_mixed_biowaste.json`| `frontend/src/store/GHGReferenceBioWasteModule.ts` |
| GHG Calculator         | Emission Factors     | | `reference-data/ghg/ghg_ef_mixed_non_biowaste_list.csv`| `frontend/src/assets/references/ghg_ef_mixed_non_biowaste_list.json`, `frontend/src/assets/references/ghg_ef_mixed_non_biowaste.json`| `frontend/src/store/GHGReferenceNonBioWasteModule.ts` |
| GHG Calculator         | Default Values       | | `reference-data/ghg/ghg_default_value.csv`             | `frontend/src/assets/references/ghg_default_value.json`| `frontend/src/store/GhgDefaultValuesModule.ts` |
| GHG Calculator         | UNHCR Locations      | | `reference-data/ghg/unhcr_location.csv`                | `frontend/src/assets/references/unhcr_location.json`| `frontend/src/store/UNHCRLocationModule.ts` |
| GHG Calculator         | GHG fNRB             | | `reference-data/ghg/ghg_fnrb.csv`                      | `frontend/src/assets/references/ghg_fnrb.json`| `frontend/src/store/GHGReferencefNRB.ts` |
| GHG Calculator         |                      | Name/Key reference for solid waste | `reference-data/ghg/ref.csv`                           | `frontend/src/assets/references/ghg_ref_key_name.json, frontend/src/assets/references/ghg_ref_name_key.json`| `frontend/src/components/green_house_gaz/wash/DomesticSolidWaste.ts`, `frontend/src/components/reference_data/GHGMixedBiowaste.vue` and `frontend/src/components/reference_data/GHGMixedNonBiowaste.vue` |
| GHG Calculator         |                      | GHG regions |                            | `frontend/src/assets/references/ghg_country_region_list.json, frontend/src/assets/references/ghg_country_region_map.json`| `frontend/src/store/GHGReferenceRegionModule.ts`,  `frontend/src/components/green_house_gaz/wash/DomesticSolidWaste.ts`|
| GHG Calculator         |                      | | `reference-data/ghg/solar_averaged.csv`                | `frontend/src/assets/references/solar_averaged.json`| `frontend/src/store/GHGReferenceSolarModule.ts`|
| Shelter Sustainability | Materials            | | `reference-data/shelter/materials.csv`                 | `frontend/src/assets/references/materials.json`| `frontend/src/store/SheltersMaterialModule.ts` |
| Shelter Sustainability | Materials Transport  | | `reference-data/shelter/transports.csv`                | `frontend/src/assets/references/transports.json`| `frontend/src/store/SheltersTransportModule.ts` |

#### How to update

##### Data curators (UNHCR)
- Data curators may update directly the CSV or an Excel version of the CSVs document, shared between UNHCR and UNICC, which developers will export as CSVs.

##### Developers (UNICC) 
- Find the appropriate csv file in the reference-data/ folder (see above for reference)
- Update/replace the csv file (should respect the same file format) which is a: `comma separated csv file``
- Run the `make setup-reference` command that will update the csv equivalent json file in the frontend/src/assets/references directory
  the output should look like this:
- Once we run the command, the changes in the frontend/src/ files should be commited to the git repo and then the frontend app deployed to the appropriate location

* Implementation details can be found :
  - [implementation history](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/580)
  - [usage of datasets](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/blob/feat/dead-code-and-reference-data/frontend/src/assets/references/README.md)
  - [reference issue 438](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/438)
  - [reference issue 467](https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/issues/467)

### Static files (documents and videos)
The static files (pdfs, videos, images, etc) are the User's guide manual and their associated videos and every pdfs used in the interface (not uploaded by an app user)

#### How to retrieve and setup
  - content: https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-11-23T100540Z/s3_cdn_dump.tar.gz 
  - content checksum: https://enacit4r-cdn.epfl.ch/unhcr-geneva-tech-hub-app/2023-11-23T100540Z/s3_cdn_dump.tar.gz.checksum

* by running `make setup-data` at the root level] you will populate the s3 (minio service) with the tar.gz linked above

#### How to update only one file
If you want to directly update a file for instance (GHG tool User's Manual):
  - Find the path of the file: which is /2023-11-23/GHG tool User's Manual v6.pdf
  - Update the file on your file storage (minio, azure blob or whatever you're using)
  - Create a backup of the blob/s3 and store it in a new tar.gz with a checksum that will superseed the above one


## Users & Roles

### Roles definition

| User Type   | Permissions                                                                      | Authenticated |
|-------------|----------------------------------------------------------------------------------|---------------|
| Normal User | - Can create an object in CouchDB (Shelter and GHG app) but Cannot Delete/Update if not in 'users' field of the object in CouchDB        | Yes |
| Admin User  | - Can access, Update, and delete every object in CouchDB                         | Yes|
| Guest User  | - Can access the app in read-only mode but Cannot create, update, or delete things                                             | No |

Admin users inherit their right one of the following ways :
* CouchDB admin with the _admin role
*  CouchDB user with an admin role
*  User's sub (from jwt) is in the unhcrAdmins array 

### Intro to CouchDB
We removed the roles in the _security policy of every database, so every user may be able to read the databases
Here is an example of policy json

Bottom line: We don't use any roles for our users (only the admin, but see below)

```json
{
  "members": {
    "roles": [],
    "names": []
  },
  "admins": {
    "roles": ["_admin"],
    "names": []
  }
}
```

Since CouchDB 3.x newly created databases have by default the _admin role to prevent unintentional access.

If there are any member names or roles defined for a database, then only authenticated users having a matching name or role are allowed to read documents from the database
cf [https://docs.couchdb.org/en/3.2.0/api/database/security.html#db-security]

### Adding a user
 - We can add a user in the users database in Couchdb
 - If you want to add a user in AZURE AD, you need to signup via https://tims.unhcr.org/signup or contact the Global Service Desk <hqussd@unhcr.org>

#### How to make a CouchDB user admin
- add the role 'admin' in the CouchDB user object

#### How to make an AZURE AD user admin
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


#### Adding a user in CouchDB

##### Create a new user
There is two way of doing this: first one using curl; second one using couchdb-bootstrap


##### Using curl
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

##### Using couchdb bootstrap
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


### User authentication flow

```mermaid
---
title: The TSS Tools' User authentication flow
Description: at app start up we check that we're already authenticated
  1) first we start a spinner
  - CouchDB authentication has priority (we use the Authorization header via cookie AuthSession http-Only samesite only)
  - If we're not already authenticated with Couchdb, we check if we have a token on the session storage, if that's the case, we store the azure user in session storage and we do nothing
    - What may happen is that we have a token which has expired. In that case, we should do nothing to not trigger errors (despite the fact that the CouchDB session API will return an http error. TODO check that)
  2) if we're not logged in (nor session storage JWT (azure) nor cookie (couchdb))
  3) we want to do a sso silent login to check that we're not already logged in Azure
    -> if we're not logged in (sso failure) --> we're a guest user
    --> if we're logged in, we store the token in the session storage and the user context via vuex/session storage
  4) if we're guest mode, we should ensure that we don't have a stale cookie by deleting session on Couchdb (that will remove couchdb cookie) and by removing the sessionStorage user that may be stale
---
sequenceDiagram
    Spinner -->>User: Start spinner
    User->>CouchDB: Are we authenticated via cookie or JWT?
    CouchDB->>User: Yes, userCtx json with name not null and sub if JWT
    User-->>Spinner: We're authenticated, cancel spinner
    CouchDB->>User: No, userCtx name null, we're not authenticated via cookie,JWT
    User->>Azure: Silent sso, to check if we're authenticated on azure
    Azure->>User: Yes
    User->>CouchDB: Check that jwt token is valid
    CouchDB->>User: Yes, userCtx json with name not null and sub if JWT
    User-->>Spinner: We're authenticated, cancel spinner
    Azure->>User: No
    User->>Guest: Guest mode (read only)
    Guest-->>Spinner: We're not authenticated, cancel spinner
    Spinner--xEndOfFlow: Stop flow

```




## Codebase structure & set-up

### Tech stack 

#### list of services
- frontend (vue2 spa using vuetify v2 framework and pouchdb)
- couchdb (behave as the backend/api prefixed by /db)
- rest-api (prefixed by /api: python fast api that allows upload and custom user signup on couchdb)
    - use boto3 to upload files to the s3 instance
    - use custom user management system for couchdb user creation and registering new users (also send email and password verification)
    - We don't store the uploaded file directly to a database, it should be done by the frontend by talking directly to couchdb. The API just return the path served by the nginx reverse proxy
- s3-server
  - nginx reverse proxy to serve and cache static file on our minio s3 instance
  - cf docker-compose file in [minio doc](./minio/README.md)
- minio
  - s3 server that allows us to store uploaded and static files for the frontend
  - [minio doc](./minio/README.md)
- traefik (global reverse proxy handling routing and cache for the whole app)
- init_couchdb and azure-cron are here to update the jwt_keys on couchDB config to allow for JWT to work properly

## CouchDB setup:
We need to run the couchdb-bootstrap to setup the databases and users, once.
- It's only necessary if you start the project with a new database with no documents
- by running `make setup-database` at the root level

### Config file
- We used to generate config file in json. But the database was starting without the proper jwt. And that does not work properly without a full restart which takes too much time
- We decided to translate manually the json to a .ini file in
`couchdb/local.ini` for now
- It should be setup by env variable via kubernetes or mounting the local.ini file as a volume


### CouchDB authentication
- more information on the [README](couchdb-setup/README.md)

## Development

- We use husky for git hooks: https://typicode.github.io/husky/#/?id=install
- We use standard version and commitlint for automatic release log and proper commit message


### CI/CD
- We use the following workflows in .github/workflows
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

#### Create .env file to hold your Secrets

We use two env files `./.env` and `./frontend/.env`
Create the files by running `make env-file`

- ./.env
  is used by every service
- ./frontend/.env
  is used by the frontend and the azure-cron for the AZURE TENANT ID

- For more information regarding the env variable necessary for the APP
  - have a look at the comments in the .env that describe each variable
  - have a look at the docker-compose file

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

#### Visual Studio Code

Run configurations are in `.vscode`: https://code.visualstudio.com/docs/editor/debugging

## Deployment

### Local build with Docker Compose

```bash
make run-local # will build with docker-compose and run docker-compose up -d without ghcr.io built images
```

### Server @EPFL Deployment process
We use enacit-ansible to automate our process with the CD service cf .github/workflows

* regular (at least weekly) releases onto the staging environment - http://unhcr-tss-test.epfl.ch/ accessible within EPFL only.
* monthly (by the 1st) releases onto the production environment  http://unhcr-tss.epfl.ch/ including only features validated.
* intermediate releases may happen occasionally for hot fixes 

Releases number follow [semantic versioning conventions](https://semver.org/\). \

#### prod and dev on docker file
- We use an override for the configuration to avoid rebuilding the images
  - for dev: `make run-dev` cf override in docker-compose.dev.yml
  - for prod: `make run` cf override in docker-compose.prod.yml


#### Releases
  - you can have a look at: https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/releases for all the releases and messages
  - You can find the images for x86-64 architecture https://github.com/orgs/EPFL-ENAC/packages?repo_name=unhcr-geneva-tech-hub-app
    - with the dev tag corresponding to the latest commit on the dev branch
    - with tag for every tagged commit of the repository (main branch, for production)
