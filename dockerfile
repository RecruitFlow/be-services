FROM node:18.14.2 AS base

ARG TARGET_SERVICE=gateway

ENV TARGET_SERVICE=${TARGET_SERVICE}

RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml if you have it
COPY package.json package.json

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# ===== Development Stage =====
FROM base AS dev

EXPOSE 3000 

RUN npx prisma generate --schema=./libs/prisma/prisma/schema.prisma

CMD ["sh", "-c", "npm run start $TARGET_SERVICE"]
# ===== Development Stage =====