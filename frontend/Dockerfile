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
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ARG BASE_URL
ENV BASE_URL $BASE_URL
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
