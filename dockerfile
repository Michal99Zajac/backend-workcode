FROM node:16-alpine as base

FROM base as deps

WORKDIR /workspace

COPY package.json .
COPY yarn.lock .
COPY src src
COPY tsconfig.json .

FROM node as builder

WORKDIR /workspace

COPY --from=deps /workspace .

RUN yarn install --immutable

CMD ["yarn", "run", "ts-node", "src/index.ts"]
