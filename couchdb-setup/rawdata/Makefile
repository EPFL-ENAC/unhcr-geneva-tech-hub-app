install:
	cat materials.csv | python materials_csv_to_json.py > ../../frontend/src/assets/references/materials.json
	cat transports.csv | python transports_csv_to_json.py > ../../frontend/src/assets/references/transports.json
	python data_converter_whole.py ../../frontend/src/assets/references/ ghg_reference.csv
	python data_converter_whole.py ../../frontend/src/assets/references/ ghg_default_value.csv
	python data_converter_whole.py ../../frontend/src/assets/references/ ghg_fnrb.csv
	mkdir -p ../bootstrap/solar_averaged
	python data_converter_whole.py ../../frontend/src/assets/references/ solar_averaged.csv
	mkdir -p ../bootstrap/unhcr_location
	python data_converter_whole.py ../../frontend/src/assets/references/ unhcr_location.csv
	mkdir -p ../bootstrap/iges_grid
	python data_converter_whole.py ../../frontend/src/assets/references/ iges_grid.csv
convert:
	python data_converter.py ../../frontend/src/assets/references/ energy_cooking_fuels.csv energy_cooking_stoves.csv
