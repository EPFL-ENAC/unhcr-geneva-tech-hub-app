FROM node:16 as build-stage
WORKDIR /app
# Files required by pnpm install
COPY package.json yarn-lock.yaml 
RUN yarn install --frozen-lockfile
COPY ./ .
RUN yarn build


FROM nginx:1.21-alpine as production-stage
RUN mkdir /app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /app


