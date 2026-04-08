FROM oven/bun:1.3.11-alpine AS base

WORKDIR /app

# copy lockfile and all package.json files
COPY package.json bun.lock* ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/errors/package.json ./packages/errors/
COPY packages/sdk/package.json ./packages/sdk/

# install dependencies
RUN bun install

# copy source
COPY apps/api/src ./apps/api/src
COPY packages/db/src ./packages/db/src
COPY packages/errors/src ./packages/errors/src
COPY packages/sdk/src ./packages/sdk/src

# copy tsconfigs
COPY apps/api/tsconfig.json ./apps/api/
COPY packages/db/tsconfig.json ./packages/db/
COPY packages/errors/tsconfig.json ./packages/errors/
COPY packages/sdk/tsconfig.json ./packages/sdk/

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]