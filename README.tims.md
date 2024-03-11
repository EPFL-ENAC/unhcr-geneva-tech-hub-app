
# Local Setup Instructions

Welcome to our project! To get your local development environment up and running, please follow these steps carefully. If you have any questions or encounter any issues, don't hesitate to ask the team lead for assistance.

## Prerequisites

Before you start, ensure you have the following prerequisites installed on your system:
- Docker
- Node 16.x
- Python 3.10.9
- `pyenv` (optional, but recommended for managing Python versions)
- `pip` for installing Python packages

## Environment Setup

1. **Mandatory files**: You will need to create and populate the following files/directories:
    - `/.env`
    - `/couchdb/.env`
    - `/couchdb/etc/`
    - `/couchdb/data/`
    - `/frontend/.env`
    - `/jobs/.env`
    - `/rest-api/.env`
Ask Team Lead for their contents.

2. **Python Version**: Use `pyenv` to set your local Python version to 3.10.9.
   ```
   pyenv local 3.10.9
   ```

3. **Virtual Environment**: Create and activate a virtual environment in the `private/venv` directory.
   ```
   python3 -m venv private/venv
   source private/venv/bin/activate
   ```

4. **Poetry**: Install Poetry for dependency management.
   ```
   pip install poetry
   ```

5. **Project Dependencies**: Install all project dependencies and set up your local development environment.
   ```
   make setup-reference
   make install
   ```

6. **Run the Development Server**: Start your local development server.
   ```
   make run-dev
   ```

7. **Access the Application**: Go to http://localhost:8085 and enter the credentials admin/couchdb to access the application

8. **Access the CouchDB Admin**: Go to http://localhost:8085/db/_utils/ and enter the credentials admin/couchdb to access the CouchDB Admin interface

9. **Stop the Development server**:
   ```
   make stop-dev
   ```

## Deploying EPFL

1. **Access the Repository:**
    - Go to the Azure DevOps repository for EPFL at [UNHCR-TSS-Devops/EPFL](https://dev.azure.com/UNHCR-TSS-Devops/EPFL).
    - Ensure you have the necessary permissions to initiate deployments.

2. **Triggering the Deployment Pipeline:**
    - Navigate to the 'Pipelines' section.
    - Find and select the `EPFL` pipeline.
    - Click on 'Run Pipeline'.
    - Select the branch you wish to deploy (e.g., `dev`, `test`, `master`).
    - Choose the corresponding environment for release (e.g., `dev`, `test`, `prod`).
    - Confirm and start the pipeline execution.

3. **Verifying Deployment:**
    - Once the pipeline completes, verify the status of the deployment.
    - Check the application in the deployed environment to ensure that updates are applied and functioning correctly.

## Additional Notes

- It's recommended to deactivate your virtual environment when you're done working on the project for the day. You can do this by running `deactivate` in your terminal.
- If you encounter any issues during the setup, please review the steps to ensure all commands were executed correctly. If the problem persists, contact the team lead for further assistance.

Thank you for contributing to our project! We're excited to have you on board.