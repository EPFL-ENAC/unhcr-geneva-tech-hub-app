# unhcr-geneva-tech-hub-app

UNHCR Geneva Technical Hub App

Regroup three projects:

- project 1 (GHG emission calculator)
- project 2 (Shelter sutainability calculator)
- project 3 (Energy)

## Project page

- https://unhcr-tss.epfl.ch

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

- If you change couchdb/etc/config.ini file
  - You'll need to do the following:
    ```
    ssh unhcr-tss.epfl.ch
    # wait to be connected
    cd /opt/unhcr-tss;
    docker-compose restart couchdb;
    ```

## Create a new user

add a new file in `couchdb/bootstrap/_users/new_username.json` with the following content:

```json
{
  "_id": "org.couchdb.user:new_username",
  "type": "user",
  "roles": ["user"],
  "name": "new_username",
  "password": "plain-password"
}
```

run the following command:

```bash
make setup-database
```

- CouchDB has hashed the password, you can get it on http://localhost:5984/\_utils/#database/\_users/\_all_docs
- find the new user and download
- save the document by deplacing `couchdb/bootstrap/_users/new_username.json`
- remove the `'_rev'` field and commit the file
