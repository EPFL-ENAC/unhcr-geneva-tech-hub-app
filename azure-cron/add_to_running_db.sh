# curl -k -X PUT https://admin:couchdb@localhost/db/_node/_local/_config/jwt_keys/rsa:kikoo -d '"prout"'

ls -- *.pem | gsed 's/\.pem//gi' \
| xargs -J{} sh -c 'pem_string=$(cat -- {}.pem);\
curl  -k -vvv -X PUT  http://admin:couchdb@localhost:5984/_node/_local/_config/jwt_keys/rsa:{} -d "$pem_string"'
# | xargs  -I {} sh -c 'curl -k -v -X PUT http://admin:couchdb@localhost:5984/_node/_local/_config/jwt_keys/rsa:{} -d <<EOF "\"$(cat -- {}.pem)\"EOF"'
