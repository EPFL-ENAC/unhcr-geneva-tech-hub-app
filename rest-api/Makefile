install:
	poetry env use python; poetry install

run:
	poetry env use python; env $(cat ../.env) poetry run uvicorn unhcr_tss.main:app --reload

lint:
	poetry run pre-commit run --all-files
