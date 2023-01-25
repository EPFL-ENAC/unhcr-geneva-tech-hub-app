#!/bin/sh

for file in $(find . -name "*.cer"); do
	outputFile=${file%.cer}.pem
	echo ${file}

	openssl x509 -pubkey -noout -in ${file} >${outputFile} || rm ${outputFile}
done
