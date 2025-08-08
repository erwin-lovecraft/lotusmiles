FROM golang:1.24.6-alpine3.22

RUN apk update

WORKDIR /api

# Retrieve application dependencies.
# This allows the container build to reuse cached dependencies.
# Expecting to copy go.mod and if present go.sum.
COPY ./api/go.* ./
RUN go mod download
