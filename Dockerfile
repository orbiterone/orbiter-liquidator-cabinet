ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.14

# BUILD ENVIRONMENT
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build

WORKDIR /app

RUN apk update

COPY package*.json ./
RUN npm ci

COPY ./ .
RUN npm run build:production

# DEPLOY ENVIRONMENT
FROM nginx:stable

ARG INSTANCE_TYPE

COPY --from=build /app/build /usr/share/nginx/app

COPY nginx.${INSTANCE_TYPE}.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
