# Build arguments
# Use docker registry by default
ARG IMAGE_REGISTRY=docker.io
ARG IMAGE=oven/bun
ARG IMAGE_TAG=1.2-alpine
ARG LINUX_IMAGE=nginx:alpine

FROM ${IMAGE_REGISTRY}/${IMAGE}:${IMAGE_TAG} AS builder

WORKDIR /app

COPY ./web .

RUN bun install
RUN bun run build

FROM ${LINUX_IMAGE} AS runner

WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
