install:
	cat materials.csv | python materials_csv_to_json.py > ../bootstrap/shelters_materials/materials.json
	cat transports.csv | python transports_csv_to_json.py > ../../frontend/public/shelter/transports.json

convert:
	python data_converter.py ../bootstrap/ energy_cooking_fuels.csv energy_cooking_stoves.csv
