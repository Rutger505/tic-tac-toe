FROM node:20-alpine AS base

# TODO whats this?
RUN apk add --no-cache gcompat


FROM base AS development

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "next-dev"]


FROM base AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


FROM base AS builder

# Code contains url using this environment variable and gets type checked.
ENV BASE_URL=http://example.com/

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN npm run build


FROM base AS production

ENV NODE_ENV=production

WORKDIR /app

EXPOSE 3000

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
