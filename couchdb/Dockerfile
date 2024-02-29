FROM couchdb:3.3

# https://docs.couchdb.org/en/stable/config/intro.html
# https://apache.googlesource.com/couchdb-docker/#configuring-couchdb
COPY local.ini /opt/couchdb/etc/

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN apt-get update && apt-get install wget python3 sed -y 

ENTRYPOINT ["/entrypoint.sh"]

CMD ["/opt/couchdb/bin/couchdb"]
