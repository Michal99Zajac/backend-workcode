FROM node:16-alpine as base

FROM base as deps

WORKDIR /workspace

COPY package.json .
COPY yarn.lock .
COPY src src

FROM node as builder

WORKDIR /workspace

COPY --from=deps /workspace .

COPY . .

RUN yarn install

CMD ["yarn", "start"]
