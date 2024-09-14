FROM node:20-alpine AS base

FROM base AS development

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["npm", "run", "next-dev"]

FROM base AS production

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
