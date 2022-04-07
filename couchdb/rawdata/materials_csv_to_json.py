import csv
import json
import sys

print(
    json.dumps([{
        "_id":
        r.get("code"),
        "material":
        r.get("material"),
        "local":
        True if float(r.get("local", "0")) == 1 else False,
        "form":
        r.get("form"),
        "density":
        float(r.get("density", "0")),
        "embodied_carbon":
        float(r.get("embodied_carbon", "0")),
        "embodied_water":
        float(r.get("embodied_water", "0")),
        "embodied_water_ref":
        r.get("embodied_water_ref"),
        "embodied_carbon_ref":
        r.get("embodied_carbon_ref"),
        "density_ref":
        r.get("density_ref"),
        "units": [unit.strip(' ') for unit in r.get("units", "").split(",")],
        "density_unit":
        r.get("density_unit"),
    } for r in csv.DictReader(sys.stdin)]))
