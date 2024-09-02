FROM oven/bun:1.1.26-debian AS development

WORKDIR /app

RUN bun --version

RUN apt-get update \
    && apt-get install -y curl sudo \
    && apt-get clean

# Install nvm (Node Version Manager)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Ensure that nvm is sourced and available in the shell
# Install Node.js version 20 using nvm
RUN bash -c "source ~/.nvm/nvm.sh && nvm install 20.17.0 && nvm use 20.17.0 && nvm alias default 20"

# Set up environment variables so nvm and Node.js are available in the shell
ENV NODE_VERSION 20.17.0
ENV NVM_DIR /root/.nvm
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

COPY . .

EXPOSE 3000
EXPOSE 3001


CMD ["npm", "run", "dev"]

FROM node:lts-alpine AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

FROM node:lts-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN npm run build


FROM node:lts-alpine AS production

# Does not know what this does
ENV NODE_ENV=production
WORKDIR /app

# Expose the port Next.js and websockets will run on
EXPOSE 3000
EXPOSE 3001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=dependencies /app/node_modules ./node_modules
CMD ["npm", "start"]
