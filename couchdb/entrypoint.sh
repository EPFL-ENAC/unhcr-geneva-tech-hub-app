#!/usr/bin/env sh
WWW_DIR=/

# see https://stackoverflow.com/questions/39082768/what-is-the-difference-between-cmd-and-entrypoint-in-a-dockerfile
echo 'start of configuration file update';
apk update;
apk add openssl;
apk add --update sed;
# have tenand-id in env
# get json from https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
temp_file=$(mktemp)
keys_json_url="https://login.microsoftonline.com/$VUE_APP_AUTH_TENANT_ID/discovery/v2.0/keys"
# echo $temp_file
# echo $keys_json_url
wget -O ${temp_file} $keys_json_url
cat /${temp_file} | python3 -c 'import sys, json; keys = json.load(sys.stdin)["keys"]; [print(i["kid"], i["x5c"][0]) for i in keys]' | awk '{ print "-----BEGIN CERTIFICATE-----\n" $2   "\n" "-----END CERTIFICATE-----\n"> ($1 ".cer") }'

for file in $(find . -name "*.cer"); do
	outputFile=${file%.cer}.pem
	echo ${file}
	openssl x509 -pubkey -noout -in ${file} >${outputFile} || rm ${outputFile}
done

# echo '; https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys'
echo '; In format rsa:<kid> = -----BEGIN PUBLIC KEY-----\\n<public-key>\\n-----END PUBLIC KEY-----\\n'
echo '; <public-key> can be get by "x509 -pubkey -noout -in cert.cer" where cert.cer is "-----BEGIN CERTIFICATE-----\\n<x5c>\\n-----END CERTIFICATE-----"'
echo '; See /azure/convert.sh'

result=$(ls -- *.pem | sed 's/\.pem//gi' \
| xargs  -I {} sh -c 'echo "rsa:{} = $(cat -- {}.pem)" '  \
| sed -z 's/\n/\\n/g' \
| sed 's/END PUBLIC KEY-----\\n/END PUBLIC KEY-----\\n\n/g'\
| sed 's/END CERTIFICATE-----\\n/END CERTIFICATE-----\\n\",\n/g')

echo "${result}" >> jwt_keys.ini

cat  local.ini | sed '/^\[jwt_keys\]/,/^\\[logs\]/{/^\[jwt_keys\]/!{/^\\[logs\]/!d;};}' > local.ini.temp
cat local.ini.temp jwt_keys.ini > local.ini
rm local.ini.temp
rm jwt_keys.ini

echo "end of configuration file update";
