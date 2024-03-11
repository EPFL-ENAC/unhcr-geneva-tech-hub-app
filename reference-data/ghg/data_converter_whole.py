#!/usr/bin/env python3
import argparse
import csv
import json
import os
from typing import Any, List, Optional, Union


def convert(filename: str, output: str):
    print(f"processing {filename} to {output}")
    folder = output
    # folder = os.path.join(output, os.path.splitext(os.path.basename(filename))[0])
    ids: List[str] = []
    with open(filename, newline="") as file:
        reader = csv.DictReader(file)
        items: List[Any] = []
        for index, row in enumerate(reader):
            try:
                id = row["_id"]
            except Exception:
                try:
                    id = row["region"]
                except Exception as inst:
                    print(row, inst)
                    raise inst
            ids.append(id)
            item = {k: mapValue(v) for k, v in row.items()}
            item["index"] = index
            items.append(item)
        newFilePath = os.path.join(folder, f"{filename.removesuffix('.csv')}.json")
        with open(newFilePath, "w") as jsonFile:
            json.dump(items, jsonFile, indent=2)


def mapValue(value: str) -> Optional[Union[str, int, float, List[Any]]]:
    if len(value) == 0:
        return None
    if value == "null":
        return None
    if value.startswith("[") and value.endswith("]"):
        return [
            mapValue(v) for v in value.removeprefix("[").removesuffix("]").split(",")
        ]
    value = value.strip()
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
