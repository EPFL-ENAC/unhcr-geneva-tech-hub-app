FROM caddy:latest

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY Caddyfile /etc/caddy/Caddyfile.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8085

ENTRYPOINT ["/entrypoint.sh"]
