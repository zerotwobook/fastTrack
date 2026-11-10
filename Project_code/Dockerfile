# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:26.13.0-bookworm-slim@sha256:add5c17c14752c54d2f3d519ec46a3815684d41c33f198bcb09fb998f7dcbf68
FROM ${NODE_IMAGE} AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm install --global npm@11.20.0 --ignore-scripts --no-audit --no-fund

FROM base AS deps
COPY package.json package-lock.json .npmrc ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN node --version && npm --version && npm ci --no-audit --no-fund

FROM deps AS builder
COPY . .
ARG RELEASE_SHA
RUN node -e "if (!/^[a-f0-9]{40}$/.test(process.env.RELEASE_SHA || '')) process.exit(1)"
# Synthetic non-routable generation input; no real database/secret is used in builds.
RUN DATABASE_URL=postgresql://build:placeholder@127.0.0.1:1/fasttrack_build npm run build
ENV RELEASE_SHA=${RELEASE_SHA}
LABEL org.opencontainers.image.revision=${RELEASE_SHA}

FROM builder AS jobs
USER node
ENV NODE_ENV=production
ENTRYPOINT ["npm"]
CMD ["run", "db:migrate", "--workspace", "@fasttrack/server"]

FROM builder AS pruner
RUN npm prune --omit=dev --ignore-scripts --no-audit --no-fund

FROM base AS runner
ARG RELEASE_SHA
ENV NODE_ENV=production PORT=8080 RELEASE_SHA=${RELEASE_SHA}
LABEL org.opencontainers.image.revision=${RELEASE_SHA}
COPY --from=pruner /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/client/package.json ./client/package.json
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared
USER node
EXPOSE 8080
ENTRYPOINT ["node", "server/dist/index.js"]
