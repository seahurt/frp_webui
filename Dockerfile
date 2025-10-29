# --- 构建阶段 ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install; fi

COPY . .

RUN npm run build

# --- 运行阶段 ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.mjs ./

COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]
