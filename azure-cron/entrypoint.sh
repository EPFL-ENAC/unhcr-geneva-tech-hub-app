#!/usr/bin/env sh

echo 'start of configuration jwt_keys update';

if [ -z "$VUE_APP_AUTH_TENANT_ID" ]; then
  echo "VUE_APP_AUTH_TENANT_ID is not set";
  exit 1;
fi
if [ -z "$COUCHDB_USER" ]; then
  echo "COUCHDB_USER is not set";
  exit 1;
fi
if [ -z "$COUCHDB_PASSWORD" ]; then
  echo "COUCHDB_PASSWORD is not set";
  exit 1;
fi

if [ -z "$COUCHDB_HOST" ]; then
  echo "COUCHDB_HOST is not set";
  exit 1;
fi

echo "run apk update and install openssl, sed, curl, jq";
apk update;
apk add openssl;
apk add --update sed;
apk add curl;
apk add jq;
# have tenand-id in env
# get json from https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys

temp_file=$(mktemp)
keys_json_url="https://login.microsoftonline.com/$VUE_APP_AUTH_TENANT_ID/discovery/v2.0/keys"

wget -O ${temp_file} $keys_json_url
cat /${temp_file} | python3 -c 'import sys, json; keys = json.load(sys.stdin)["keys"]; [print(i["kid"], i["x5c"][0]) for i in keys]' | awk '{ print "-----BEGIN CERTIFICATE-----\n" $2   "\n" "-----END CERTIFICATE-----\n"> ($1 ".cer") }'

for file in $(find . -name "*.cer"); do
	outputFile=${file%.cer}.pem
	echo ${file}
	openssl x509 -pubkey -noout -in ${file} >${outputFile} || rm ${outputFile}
done

result=$(echo "{"
ls -- *.pem | sed 's/\.pem//gi' \
| xargs  -I {} sh -c 'echo "\"rsa:{}\": \"$(cat -- {}.pem)" '  \
| sed -z 's/\n/\\\\n/g' \
| sed 's/END PUBLIC KEY-----\\\\n/END PUBLIC KEY-----\\\\n\",\n/g'\
| sed 's/END CERTIFICATE-----\\\\n/END CERTIFICATE-----\\\\n\",\n/g'
echo "}"
)


echo "${result}" >> jwt_keys.json

sed -zi 's/,\n}/\n}/g'  jwt_keys.json

for key in $(jq -r 'keys[]' jwt_keys.json); do
  echo "BEGIN------------------------"
  value=$(jq ".[\"$key\"]" jwt_keys.json | sed 's/"//gi')
  echo "key: $key"
  echo "value: \"${value}\""
  curl -k -vvv -X PUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_HOST}:5984/_node/_local/_config/jwt_keys/${key}" -d "\"${value}\""
  echo "-----------------------END"
done

rm jwt_keys.json

# reload configuration
# POST /_node/nonode@nohost/_config/_reload 
curl -X POST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_HOST}:5984/_node/_local/_config/refresh"

echo "end of configuration jwt_keys update";
