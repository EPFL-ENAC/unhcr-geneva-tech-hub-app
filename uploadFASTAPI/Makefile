install:
	poetry env use python; poetry install

run:
	poetry env use python; poetry run dotenv -f ../.env run uvicorn unhcr_tss.main:app --reload

lint:
	poetry run pre-commit run --all-files
