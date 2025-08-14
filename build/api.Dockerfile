# Build arguments
# Use docker registry by default
ARG IMAGE_REGISTRY=docker.io
ARG GO_IMAGE=golang
ARG GO_IMAGE_TAG=1.24.6-alpine3.22
ARG LINUX_IMAGE=alpine:3.22

# Build stage
FROM ${IMAGE_REGISTRY}/${GO_IMAGE}:${GO_IMAGE_TAG} AS builder

WORKDIR /api

COPY ./api .

RUN go mod download

RUN go build -o serverd ./cmd/serverd

# Run stage
FROM ${IMAGE_REGISTRY}/${LINUX_IMAGE} AS runner

WORKDIR /

COPY --from=builder /api/serverd /serverd
COPY --from=builder /api/config.env.template /config.env

CMD ["sh", "-c", "/serverd"]
