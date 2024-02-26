FROM caddy:latest

COPY Caddyfile /etc/caddy/Caddyfile.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8085

ENTRYPOINT ["/entrypoint.sh"]
