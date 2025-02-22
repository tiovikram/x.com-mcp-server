FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
COPY src/ /app/src
COPY tsconfig.json /app/tsconfig.json

RUN npm install -g pnpm
RUN --mount=type=cache,target=/root/.pnpm pnpm install

RUN pnpm run build

FROM node:22-alpine AS release

RUN npm install -g pnpm

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules/

ENV NODE_ENV=production

WORKDIR /app

ENTRYPOINT ["node", "dist/index.js"]
