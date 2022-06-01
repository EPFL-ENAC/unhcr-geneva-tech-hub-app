import csv
import json
import sys

na = "n.a."
print(
    json.dumps([{
        "_id":
        r.get("_id"),
	"t":
        0 if r.get("t") == na else float(r.get("t", "0")),
	"o":
        0 if r.get("o") == na else float(r.get("o", "0"))
    } for r in csv.DictReader(sys.stdin)]))
