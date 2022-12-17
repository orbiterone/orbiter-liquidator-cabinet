ARG NODE_VERSION=16
ARG ALPINE_VERSION=3.14

# BUILD ENVIRONMENT
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} as build

WORKDIR /app

RUN apk update

COPY package*.json ./
RUN npm ci

COPY ./ .
RUN npm run build:prod

# DEPLOY ENVIRONMENT
FROM nginx:stable

COPY --from=build /app/dist /usr/share/nginx/app/dist
COPY --from=build /app/error.html /usr/share/nginx/app

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
