FROM node:16-alpine AS builder
ENV NODE_ENV production

# couchbase sdk requirements
ENV PYTHONUNBUFFERED=1
RUN apk update && apk add --update --no-cache yarn curl python3 bash g++ make && ln -sf python3 /usr/bin/python && rm -rf /var/cache/apk/*
# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

# If you are building your code for production
RUN yarn install --production
# Bundle app source
COPY src/ src/
COPY tsconfig.json ./

RUN yarn run build
# RUN echo $(ls -R /app/dist/sql)

FROM node:16-alpine AS production
WORKDIR /app
# copy from build image
COPY --from=builder /app /app
# Add bash to explore the container's filesystem
RUN apk add --no-cache bash

# RUN echo $(ls -R /app/dist/sql)

EXPOSE 8021
CMD [ "node", "dist/server.js" ]