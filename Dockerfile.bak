FROM node:16-alpine AS development
# Add bash to explore the container's filesystem
RUN apk add --no-cache bash
ENV NODE_ENV development
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Allow to cache node_modules by copying package.json and yarn.lock first
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install
COPY ./ /usr/src/app
EXPOSE 3000
CMD [ "yarn", "run", "start:dev" ]

FROM node:16-alpine AS builder
ENV NODE_ENV production
RUN mkdir -p /cache
WORKDIR /app
# Allow to cache node_modules by copying package.json and yarn.lock first
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY ./ ./
RUN yarn build

FROM nginx:1.24.0-alpine AS production
# Add bash to explore the container's filesystem
RUN apk add --no-cache bash
COPY --from=builder /app /usr/share/nginx/html
# Delete default nginx conf
RUN rm /etc/nginx/conf.d/default.conf
# Add our nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.con
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]