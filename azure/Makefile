.PHONY: install clean convert add_to_config

all: finale

finale: add_to_config
	make clean

import: clean
	./import.sh

add_to_config: import
	$(info ************ RELEASE VERSIOIN **********)
	$(info Replace the jwt_keys.json as the value of the jwt_keys key of couchdb-setup/bootstrap-setup/_config.json)
	$(info to replace existing certificate:)
	./add_to_config.sh > jwt_keys.json

clean:
	rm -f -- *.pem
	rm -f -- *.cer
