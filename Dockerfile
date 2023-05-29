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

FROM node:16-alpine as BUILD_IMAGE
ENV NODE_ENV production
WORKDIR /app
# Allow to cache node_modules by copying package.json and yarn.lock first
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production --ignore-scripts --prefer-offline
COPY . .
RUN yarn build

FROM node:16-alpine as production
WORKDIR /app
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
EXPOSE 3000
CMD ["yarn", "start"]