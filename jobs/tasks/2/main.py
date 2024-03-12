import os
import requests
import json
import subprocess
import tempfile

# Verifica che tutte le variabili di ambiente necessarie siano impostate
required_env_vars = ["AZURE_TENANT_ID", "COUCHDB_USER", "COUCHDB_PASSWORD", "COUCHDB_HOST"]
for var in required_env_vars:
    if var not in os.environ:
        raise EnvironmentError(f"{var} is not set")

# Recupera le chiavi JWT da Microsoft
tenant_id = os.getenv("AZURE_TENANT_ID")
keys_json_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
response = requests.get(keys_json_url)
keys = response.json()['keys']

# Converti le chiavi X5C in certificati PEM e poi in chiavi pubbliche
jwt_keys = {}
for key in keys:
    kid = key['kid']
    x5c = key['x5c'][0]  # Prendi il primo certificato X5C
    cert = f"-----BEGIN CERTIFICATE-----\n{x5c}\n-----END CERTIFICATE-----"
    # Usa openssl per convertire il certificato in chiave pubblica
    result = subprocess.run(['openssl', 'x509', '-pubkey', '-noout', '-inform', 'PEM', '-outform', 'PEM'],
                            input=cert.encode(), capture_output=True, check=True)
    # Formatta la chiave pubblica per CouchDB
    pem_key = result.stdout.decode().strip().replace("\n", "\\n")
    jwt_keys[f'rsa:{kid}'] = pem_key

# Aggiorna le chiavi JWT in CouchDB
couchdb_user = os.getenv("COUCHDB_USER")
couchdb_password = os.getenv("COUCHDB_PASSWORD")
couchdb_host = os.getenv("COUCHDB_HOST")
headers = {'Content-Type': 'application/json'}

for key, value in jwt_keys.items():
    print(f"Updating key: {key}")
    data = json.dumps(value)  # Converti il valore in una stringa JSON
    url = f"http://{couchdb_user}:{couchdb_password}@{couchdb_host}:5984/_node/_local/_config/jwt_keys/{key}"
    response = requests.put(url, headers=headers, data=data)
    if response.status_code not in [200, 201]:
        print(f"Error updating key {key}: {response.text}")
    else:
        print(f"Key {key} updated successfully")

print("JWT keys update completed.")
