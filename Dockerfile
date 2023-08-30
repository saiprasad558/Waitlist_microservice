FROM node:16-alpine

WORKDIR /usr/src/app

ARG NPM_TOKEN

COPY package.json yarn.lock .npmrc ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

ENV NPM_TOKEN=$NPM_TOKEN

CMD ["yarn", "start:prod"]