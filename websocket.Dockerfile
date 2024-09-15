FROM oven/bun:1.1.26-debian AS base

FROM base AS development

ENV DEBUG=*

WORKDIR /app

COPY . .

EXPOSE 3001

CMD ["bun", "--hot", "src/app/api/websockets.ts"]


FROM base AS production

WORKDIR /app

COPY . .

CMD ["bun", "src/app/api/websockets.ts"]
