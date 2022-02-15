install:
	poetry install
	poetry run pre-commit install

run:
	poetry run dotenv -f ../.env run uvicorn unhcr_tss.main:app --reload

test:
	poetry run pytest

lint:
	poetry run pre-commit run --all-files
