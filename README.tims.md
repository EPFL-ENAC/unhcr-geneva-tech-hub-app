
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

1. **Environment Variables**: You'll need to set up environment variables for different parts of the project. Please ask the team lead for the content of each `.env` file. You will need to create and populate the following files:
    - Project root: `.env`
    - Frontend: `/frontend/.env`
    - Backend (rest-api): `/rest-api/.env`

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

8. **Access the CouchDB Admin**: Go to http://localhost:5984/_utils and enter the credentials admin/couchdb to access the CouchDB Admin interface


## Additional Notes

- It's recommended to deactivate your virtual environment when you're done working on the project for the day. You can do this by running `deactivate` in your terminal.
- If you encounter any issues during the setup, please review the steps to ensure all commands were executed correctly. If the problem persists, contact the team lead for further assistance.

Thank you for contributing to our project! We're excited to have you on board.
