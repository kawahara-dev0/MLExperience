.PHONY: help build up down logs clean restart dev prod

# Default target
help:
	@echo "Available commands:"
	@echo "  make build    - Build Docker images"
	@echo "  make up       - Start containers (development)"
	@echo "  make down     - Stop containers"
	@echo "  make logs     - Show logs"
	@echo "  make clean    - Remove containers and volumes"
	@echo "  make restart  - Restart containers"
	@echo "  make dev      - Start development environment"
	@echo "  make prod     - Start production environment"

# Build Docker images
build:
	docker-compose build

# Start containers (development)
up:
	docker-compose up -d

# Stop containers
down:
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Remove containers and volumes, prune system
clean:
	docker-compose down -v
	docker system prune -f

# Restart containers
restart:
	docker-compose restart

# Alias for development
dev: up

# Start production environment
prod:
	docker-compose -f docker-compose.prod.yml up -d --build
