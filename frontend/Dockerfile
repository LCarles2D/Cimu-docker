FROM node:22-alpine AS base
WORKDIR /app
COPY ./Pagina_web_CIMU/package*.json ./


FROM base AS build-deps
RUN npm install
COPY ./Pagina_web_CIMU/ ./
RUN npm run build

FROM base AS prod-deps
RUN npm install --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache poppler-utils
RUN mkdir -p /app/public/uploads && chown -R node:node /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build-deps /app/dist ./dist
COPY --from=build-deps /app/package.json ./package.json

USER node

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
