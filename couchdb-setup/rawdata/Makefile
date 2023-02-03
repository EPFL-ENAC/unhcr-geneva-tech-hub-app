install:
	cat materials.csv | python materials_csv_to_json.py > ../bootstrap/shelters_materials/materials.json
	cat transports.csv | python transports_csv_to_json.py > ../../frontend/public/shelter/transports.json
	python data_converter_whole.py ../bootstrap/ ghg_reference.csv
	python data_converter_whole.py ../bootstrap/ ghg_fnrb.csv
	mkdir -p ../bootstrap/solar_averaged
	python data_converter_whole.py ../bootstrap/ solar_averaged.csv
	mkdir -p ../bootstrap/unhcr_location
	python data_converter_whole.py ../bootstrap/ unhcr_location.csv

convert:
	python data_converter.py ../bootstrap/ energy_cooking_fuels.csv energy_cooking_stoves.csv
