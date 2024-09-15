FROM node:20-alpine AS base

FROM base AS development

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["npm", "run", "next-dev"]

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

RUN npm run build


FROM base AS production


ENV NODE_ENV=production

WORKDIR /app


EXPOSE 3000

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=dependencies /app/node_modules ./node_modules
CMD ["npm", "start"]
