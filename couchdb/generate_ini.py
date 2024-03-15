import os
import requests

# Base configuration
base_config = """
[couchdb]
single_node = true

[httpd]
enable_cors = false

[chttpd]
authentication_handlers = {chttpd_auth, jwt_authentication_handler}, {chttpd_auth, cookie_authentication_handler}, {chttpd_auth, default_authentication_handler}

[chttpd_auth]
require_valid_user = false,
allow_persistent_cookies = true
timeout = 86400
same_site = strict

[jwt_auth]
required_claims = exp,iat

[logs]
debug = true

"""

# Fetch JWT keys from Microsoft
tenant_id = os.getenv("AZURE_TENANT_ID")
url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
response = requests.get(url)
keys = response.json()['keys']

# Generate [jwt_keys] section
jwt_keys_config = "[jwt_keys]\n"
for key in keys:
    kid = key['kid']
    x5c = key['x5c'][0]  # Prendi il primo certificato X5C
    jwt_keys_config += f"rsa:{kid} = -----BEGIN PUBLIC KEY-----\\n{x5c}\\n-----END PUBLIC KEY-----\\n\n"

# Combine the base configuration with the JWT keys section
final_config = base_config + jwt_keys_config

# Write the final configuration to local.ini
with open('/opt/couchdb/etc/local.ini', 'w') as f:
    f.write(final_config)
