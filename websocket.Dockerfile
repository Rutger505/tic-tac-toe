FROM imbios/bun-node:1.1.30-22-debian AS base

FROM base AS development

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

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

RUN npx prisma generate


FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

EXPOSE 3001

# TODO only import websockets.ts and websocket.ts files
COPY --from=builder /app/src ./src
# TODO: tsconfig neccessary?
COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["bun", "src/app/api/websockets.ts"]
