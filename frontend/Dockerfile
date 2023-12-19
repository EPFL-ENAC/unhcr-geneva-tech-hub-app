FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
COPY npm-shrinkwrap.json ./
RUN npm ci
COPY public ./public
COPY src ./src
COPY *.js ./
COPY *.conf ./
COPY *.json ./
RUN npm run build

FROM nginx:stable-alpine as production-stage

RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /app
EXPOSE 80

COPY entrypoint.sh /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
