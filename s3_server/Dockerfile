FROM nginx:stable-alpine as production-stage
COPY default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
EXPOSE 5660
CMD ["nginx", "-g", "daemon off;"]