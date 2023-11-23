#!/bin/sh
echo '; https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys'
echo '; In format rsa:<kid> = -----BEGIN PUBLIC KEY-----\\n<public-key>\\n-----END PUBLIC KEY-----\\n'
echo '; <public-key> can be get by "x509 -pubkey -noout -in cert.cer" where cert.cer is "-----BEGIN CERTIFICATE-----\\n<x5c>\\n-----END CERTIFICATE-----"'
echo '; See /azure/convert.sh'

ls -- *.pem | gsed 's/\.pem//gi' \
| xargs  -I {} sh -c 'echo "rsa:{} = $(cat -- {}.pem)" '  \
| gsed -z 's/\n/\\n/g' \
| gsed 's/END PUBLIC KEY-----\\n/END PUBLIC KEY-----\\n\n/g'\
| gsed 's/END CERTIFICATE-----\\n/END CERTIFICATE-----\\n\",\n/g'
