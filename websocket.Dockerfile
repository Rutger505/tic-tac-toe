FROM oven/bun:1.1.27-debian AS base

FROM base AS development

WORKDIR /app

COPY . .

EXPOSE 3001

CMD ["bun", "--hot", "src/app/api/websockets.ts"]


FROM base AS base-with-npm

RUN apt-get update  \
    && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

FROM base-with-npm AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM base-with-npm AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN npx prisma generate

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

EXPOSE 3001

COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

CMD ["bun", "src/app/api/websockets.ts"]
