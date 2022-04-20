import argparse
import csv
import json
import os
from typing import Any, List, Optional, Union


def convert(filename: str, output: str):
    print(f"processing {filename} to {output}")
    folder = os.path.join(output, os.path.splitext(os.path.basename(filename))[0])
    ids: List[str] = []
    with open(filename, newline="") as file:
        reader = csv.DictReader(file)
        for index, row in enumerate(reader):
            id = row["_id"]
            ids.append(id)
            item = {k: mapValue(v) for k, v in row.items()}
            item["index"] = index
            with open(os.path.join(folder, f"{id}.json"), "w") as jsonFile:
                json.dump(item, jsonFile, indent=2)
    print(" | ".join([f'"{id}"' for id in ids]))
    print()


def mapValue(value: str) -> Optional[Union[str, int, float, List[Any]]]:
    if len(value) == 0:
        return None
    if value.startswith("[") and value.endswith("]"):
        return [
            mapValue(v) for v in value.removeprefix("[").removesuffix("]").split(",")
        ]
    try:
        return int(value)
    except ValueError:
        try:
            return float(value)
        except ValueError:
            return value


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convert CSV data to CouchDB Bootstrap JSON"
    )
    parser.add_argument(
        "output",
        help="Output folder",
        type=str,
    )
    parser.add_argument(
        "filenames",
        help="csv files",
        nargs="+",
        type=str,
    )
    args = parser.parse_args()
    output: str = args.output
    filenames: List[str] = args.filenames
    for filename in filenames:
        convert(filename, output)
