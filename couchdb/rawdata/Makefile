install:
	cat materials.csv | python convertMaterialsCsvToJSON.py > ../bootstrap/ghg_reference/materials.json

convert:
	python data_converter.py ../bootstrap/ energy_cooking_fuels.csv energy_cooking_stoves.csv
