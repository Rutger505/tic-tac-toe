FROM oven/bun:1.1.26-debian AS base

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


FROM base AS development

WORKDIR /app

COPY . .

EXPOSE 3000
EXPOSE 3001


CMD ["npm", "run", "dev"]


FROM base AS production

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

CMD ["npm", "run", "production"]
