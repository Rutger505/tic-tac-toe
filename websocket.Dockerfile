FROM oven/bun:1.1.27-alpine AS base

FROM base AS development

WORKDIR /app

COPY . .

EXPOSE 3001

CMD ["bun", "--hot", "src/app/api/websockets.ts"]


FROM base AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM base AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN prisma generate

FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

EXPOSE 3001

COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=dependencies /app/node_modules ./node_modules

CMD ["bun", "src/app/api/websockets.ts"]
