#!/bin/sh
echo "{"
ls -- *.pem | gsed 's/\.pem//gi' \
| xargs  -I {} sh -c 'echo "\"rsa:{}\": \"$(cat -- {}.pem)" '  \
| gsed -z 's/\n/\\\\\\n/g' \
| gsed 's/END PUBLIC KEY-----\\\\\\n/END PUBLIC KEY-----\\\\\\n\",\n/g'\
| gsed 's/END CERTIFICATE-----\\\\\\n/END CERTIFICATE-----\\\\\\n\",\n/g'
echo "}\n\n"
