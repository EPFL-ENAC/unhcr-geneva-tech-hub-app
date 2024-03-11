FROM python:3.12-alpine

RUN apk update
RUN apk add --update openssl curl jq sed

# /etc/periodic/hourly
# /etc/periodic/daily
# /etc/periodic/weekly
# /etc/periodic/monthly

COPY entrypoint.sh /entrypoint.sh
COPY entrypoint.sh /etc/periodic/15min/entrypoint
RUN chmod +x /entrypoint.sh /etc/periodic/15min/entrypoint


ENTRYPOINT ["/entrypoint.sh"]

# -f | Foreground
# -l N | Set log level. Most verbose 0, default 8
CMD ["crond", "-f", "-l", "8", "-L", "/var/log/cron.log"]
