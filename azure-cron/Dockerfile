FROM python:3.12-alpine

RUN apk update
RUN apk add --update openssl curl jq sed

# /etc/periodic/hourly
# /etc/periodic/daily
# /etc/periodic/weekly
# /etc/periodic/monthly

COPY add_jwt_keys_to_couchdb_via_api.sh /add_jwt_keys_to_couchdb_via_api.sh
COPY add_jwt_keys_to_couchdb_via_api.sh /etc/periodic/15min/add_jwt_keys_to_couchdb_via_api
RUN chmod +x /add_jwt_keys_to_couchdb_via_api.sh /etc/periodic/15min/add_jwt_keys_to_couchdb_via_api

# -f | Foreground
# -l N | Set log level. Most verbose 0, default 8
CMD ["crond", "-f", "-l", "8", "-L", "/var/log/cron.log"]
