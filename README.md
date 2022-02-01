# unhcr-geneva-tech-hub-app

UNHCR Geneva Technical Hub App

Regroup three projects: 
    -  project 1 (GHG emission calculator)
    -  project 2 (Shelter sutainability calculator)
    -  project 3 ( ? )

## Project page

- [project page](https://www.notion.so/enacit4r/9df03c05c0724fe7ae2b653836453253?v=e5af206750924a6bbe7fc72b5314a127&p=5759e42031cd429c8052418621d69889)
- [test url](http://enacvm0084.xaas.epfl.ch/)

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

### Installation

```bash
make install
```

### Run for development

#### CLI

```bash
make run-frontend
# http://127.0.0.1:8080
```

#### Visual Studio Code

Run configurations are in `.vscode`: https://code.visualstudio.com/docs/editor/debugging

## Deployment

### Locally with Docker Compose

```bash
make run
```

### Server

#### Prerequisites

1. Add config to your .ssh/config or try your connection to your vm by using ssh -i (private_key) -l root enacvm0084.xaas.epfl.ch

```
Host enacvm0084.xaas.epfl.ch
    User root
    IdentityFile ~/.ssh/id_ed25519_private_key
```

2. Create new branch/Merge request in repository enacit-ansible for the vm provisioning
3. Authorize cloning from the vm by adding a 'deploy-key' in the github setting of this repository
   - the 'deploy-key' is the public key of the machine created by the provisioning
4. Follow instruction in repository enacit-ansible to:
    - deploy-os
    - deploy-app
5. Your Makefile should contain a 'run' command
