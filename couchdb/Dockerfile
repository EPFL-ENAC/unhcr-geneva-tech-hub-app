FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache make
RUN npm install
COPY ./ .

