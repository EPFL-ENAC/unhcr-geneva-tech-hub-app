.PHONY: all install clean convert add_to_config add_to_ini

all: add_to_config add_to_ini
	make clean

import: clean
	./import.sh

# deprecated
add_to_config: import
	$(info ************ RELEASE VERSIOIN **********)
	$(info Replace the jwt_keys.json as the value of the jwt_keys key of couchdb-setup/bootstrap-setup/_config.json)
	$(info to replace existing certificate:)
	./add_to_config.sh > jwt_keys.json

# convert to ini file
add_to_ini: import
	$(info ************ RELEASE VERSIOIN **********)
	$(info Replace the jwt_keys.ini as the value of the jwt_keys key of couchdb/local.ini)
	$(info to replace existing certificate:)
	./add_to_ini.sh > jwt_keys.ini
	cat  ../couchdb/local.ini | sed '/^\[jwt_keys\]/,/^\\[logs\]/{/^\[jwt_keys\]/!{/^\\[logs\]/!d;};}' > ../couchdb/local.ini.temp
	cat ../couchdb/local.ini.temp jwt_keys.ini > ../couchdb/local.ini
	rm ../couchdb/local.ini.temp

clean:
	rm -f -- *.pem
	rm -f -- *.cer
