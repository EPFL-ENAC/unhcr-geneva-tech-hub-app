#!/bin/sh
echo "Copy paste the following at the end of couchdb/etc/config.ini replace existing certifacate" 
ls *.pem | sed 's/\.pem//gi' | xargs  -I {} sh -c 'echo "rsa:{} = $(cat {}.pem)" ' | sed -z 's/\n/\\n/g' | sed 's/END PUBLIC KEY-----\\n/END PUBLIC KEY-----\\n\n/g'