import os

JOBS = {
    "0": {
        "description": "Dump CouchDB data",
    },
    "1": {
        "description": "Restore CouchDB data",
    },
    "2": {
        "description": "Dump CouchDB data through couchdb-dump",
    },
    "3": {
        "description": "Restore CouchDB data through couchdb-dump",
    }
}

BASE_PATH = os.getenv("BASE_PATH", "/home")