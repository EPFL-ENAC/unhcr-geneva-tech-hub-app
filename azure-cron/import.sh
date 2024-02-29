#!/bin/sh

# have tenand-id in env
# get json from https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
export $(echo $(cat ../frontend/.env | sed 's/#.*//g'| xargs) | envsubst)
echo "TENANT_ID" $VUE_APP_AUTH_TENANT_ID
temp_file=$(mktemp)
keys_json_url="https://login.microsoftonline.com/$VUE_APP_AUTH_TENANT_ID/discovery/v2.0/keys"
echo $temp_file
echo $keys_json_url
wget -O ${temp_file} $keys_json_url
cat /${temp_file} | python -c 'import sys, json; keys = json.load(sys.stdin)["keys"]; [print(i["kid"], i["x5c"][0]) for i in keys]' | awk '{ print "-----BEGIN CERTIFICATE-----\n" $2   "\n" "-----END CERTIFICATE-----\n"> ($1 ".cer") }'

./convert.sh

## cleaning tmp files
rm ${temp_file}