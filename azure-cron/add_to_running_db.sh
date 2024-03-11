# curl -k -X PUT https://admin:couchdb@localhost/db/_node/_local/_config/jwt_keys/rsa:kikoo -d '"prout"'

ls -- *.pem | gsed 's/\.pem//gi' \
| xargs -J{} sh -c 'pem_string=$(cat -- {}.pem);\
curl  -k -vvv -X PUT  http://admin:couchdb@localhost:5984/_node/_local/_config/jwt_keys/rsa:{} -d "$pem_string"'
# | xargs  -I {} sh -c 'curl -k -v -X PUT http://admin:couchdb@localhost:5984/_node/_local/_config/jwt_keys/rsa:{} -d <<EOF "\"$(cat -- {}.pem)\"EOF"'
printf "%q" "hello\world"

"-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArV8eXna9NCyzvgVZvbz1\\n8NhLIAfo1Qzn+VQQCbQzyGi2KDe3RI2sLeHltv9mVI2sahcRjgvhYNSETyxqHaKw\\n3w8L4jg0kJdfzhD8dvpl32hunOCzuY2WpyJVq6CkxzGN4iikWTEIe/GMGsu9qhdx\\nybaTCBTAya8qyKL1sbEByk8FiY6nsm6BhuRUVCh/rzfAp3HY+U/58ORLF1tmZrmS\\nljHMFwlxvYuOIlKHacXy9gen8HsT7PUSA4n2PdnT1XAmlKJG1mzvdqyG2L3iRQJ4\\n5tcmrERKcd1pYwhb7ZtTyKypkeR9lkKbaYiQUt1QhpeO12pH1bRB1/k9MMzOm8Ca\\n1QIDAQAB\\n-----END PUBLIC KEY-----\\n\n"