# unhcr-geneva-tech-hub-app

UNHCR Geneva Technical Hub App

## Status
Currently under development, release 1.0 expected March 2023, then user testing.

## Update references files
1. go to https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/blob/main/frontend/src/assets/references/ghg_reference.json
2. Click on the 'edit this file' button (small pencil icon on the top)
  - <img width="1740" alt="click_on_edit" src="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/assets/161889/45f7ce45-0034-4c85-8811-562898788941">

4. Edit file and click on 'commit changes' button
  - <img width="1740" alt="commit-changes" src="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/assets/161889/bbf96be1-b91b-4cf5-bcc3-ad01b4492ad9">

5. On the popup select 'create a new branch' instead of 'commit directly to main branch'
  - Change the name of the branch so it reflects your changes
  - Click on 'propose changes'
  - <img width="1725" alt="create-new-branch" src="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/assets/161889/1a719328-4d0b-4afd-8c33-92674a9c73d5">

5. On the pull request page
  - Edit the description
  - Add the 'ghg' tag at least
  - Add the appropriates assignees, milestones and projects
  - Click on 'create pull request
  <img width="1719" alt="create_pull-request" src="https://github.com/EPFL-ENAC/unhcr-geneva-tech-hub-app/assets/161889/8b099d0d-dfce-4e4b-ba09-8d9d8b68c4fa">

## Development

- We use husky for git hooks: https://typicode.github.io/husky/#/?id=install
- We use standard version and commitlint for automatic release log and proper commit message

### Prerequisites

Prerequisites:

- [Make](https://www.gnu.org/software/make/) (gnu make)
- [Node.js](https://nodejs.org/) 16.x
  - use nvm https://github.com/nvm-sh/nvm#installing-and-updating
  - nvm install --lts; nvm use --lts
- [yarn]
- [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/) 1.27.0+

### Run for development

#### information about 127.0.0.11 as the static docker dns ip
From: https://hwchiu.medium.com/fun-dns-facts-learned-from-the-kind-environment-241e0ea8c6d4
Readers familiar with Docker Compose are likely aware that for convenient communication between containers, container names can be used directly as DNS targets. This design eliminates the need for containers to worry about IP changes. Docker, in fact, embeds a DNS server within its system to handle this issue, with the DNS server’s fixed IP being 127.0.0.11.

The responsibilities of this DNS server can be categorized as follows:

If the DNS request is for a container name, the IP of the container is returned.
Otherwise, based on the host configuration, the DNS request is forwarded to an upstream DNS server.
In the example depicted below, two containers, named “hwchiu” and “hwchiu2,” are running. Using nslookup, one can easily resolve the corresponding IP addresses. It’s also observable that the /etc/hosts file within these containers dynamically point to 127.0.0.11. This implies that all DNS requests within the containers are redirected to the built-in Docker DNS server.

#### Create .env file to hold your Secrets

An environment file should be created; you may copy paste the following
code, don't forget to replace by the appropriate bucket name and HOSTNAME

- you could run the following script, or just run `make env-file`
```bash
tee -a .env << EOF
COUCHDB_USER=admin
COUCHDB_PASSWORD=couchdb
COUCHDB_HOST=localhost
# docker epfl for internal nginx-minio
DNS=127.0.0.11

# used by nginx s3 service and fast api boto api and minio
S3_ENDPOINT_HOSTNAME=nginx-minio:9000
S3_ENDPOINT_PROTOCOL=http://
S3_ACCESS_KEY_ID=XXXXXX_REPLACE__ME_XXX
S3_SECRET_ACCESS_KEY=XXXXXX_REPLACE__ME_XXX
S3_REGION=EU
S3_Bucket=XXXXXX_REPLACE__ME_XXX
# for instance if S3_Key is foo/bar/ ; the url will start with: /s3/foo/bar/ we use 'unhcr-tss/' for the prod instance
S3_Key=XXXXXX_REPLACE__ME_XXX

# Mailer option for login/registering/password reset
MAIL_USERNAME=
MAIL_PASSWORD=
# inside the epfl network we use "noreply+unhcr-tss@epfl.ch"
MAIL_FROM="noreply+unhcr-tss@yourfqdn.com"
MAIL_PORT=25
# use whatever mail server you want but be sure to have a valid from address we use mail.epfl.ch inside the epfl network
MAIL_SERVER=mail.yourfqdn.com
MAIL_FROM_NAME=UNHCR-TSS
MAIL_STARTTLS=true
MAIL_SSL_TLS=false
USE_CREDENTIALS=true

# use in email template in rest-api should be 'https://yourfqdn.com' if you want the user to be redirected there
HOST_NAME=http://localhost:8080
EOF
```

#### Installation

```bash
make install
```

#### CLI

```bash
make run-database;
make setup-database;
make run-frontend;
# http://127.0.0.1:8080
```

#### Visual Studio Code

Run configurations are in `.vscode`: https://code.visualstudio.com/docs/editor/debugging

## Deployment

### Local build with Docker Compose

```bash
make run # will build with docker-compose and run docker-compose up -d
```

### Server

We use enacit-ansible to automate our process

Just run the following command and it will install the latest commit from the main branch

```
ansible-playbook -v -i inventory/unhcr-tss.epfl.ch.yml  playbooks/deploy-app.yml
```

- If you change couchdb-setup/etc/config.ini file
  - You'll need to do the following:
    ```
    ssh unhcr-tss.epfl.ch
    # wait to be connected
    cd /opt/unhcr-tss;
    docker-compose restart couchdb;
    ```
  - same for unhcr-tss-test.epfl.ch

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
- run the following command:

```bash
make setup-database
```

- CouchDB has hashed the password, you can get it on http://localhost:5984/\_utils/#database/\_users/\_all_docs
- find the new user and download
- save the document by deplacing `couchdb-setup/bootstrap/_users/new_username.json`
- remove the `'_rev'` field and commit the file

## Update public keys for unhcr azure server
- run make azure
```bash
make azure
```
- then copy the content of the json `azure/jwt_keys.json` at the proper place inside couchdb-setup/bootstrap/_config.json
- verify that the json is valid

## file uploads
- 2 services necessary
  - nginx proxy to our custom epfl s3 instance
  - python fast api using boto3 to upload files to the s3 instance
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
