# -------- Build stage --------
    FROM golang:1.21-alpine AS builder

    WORKDIR /app
    
    RUN apk add --no-cache git
    
    COPY go.mod go.sum ./
    RUN go mod download
    
    COPY . .
    
    # Adjust path if your main.go is elsewhere
    RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
        go build -o app ./cmd/server
    
    # -------- Runtime stage --------
    FROM alpine:3.19
    
    RUN apk --no-cache add ca-certificates
    
    WORKDIR /app
    
    COPY --from=builder /app/app .
    
    # Fly.io expects 8080
    EXPOSE 8080
    
    CMD ["./app"]
    