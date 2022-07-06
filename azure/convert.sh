#!/bin/sh

for file in $(find . -name "*.cer"); do
	outputFile=${file%.cer}.pem
	openssl x509 -pubkey -noout -in ${file} >${outputFile}
done
