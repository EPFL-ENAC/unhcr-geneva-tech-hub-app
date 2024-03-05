import os

JOBS = {
    "0": {
        "description": "Dump CouchDB data",
    },
    "1": {
        "description": "Restore CouchDB data",
    }
}

BASE_PATH = os.getenv("BASE_PATH", "/home")