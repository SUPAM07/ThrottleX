.PHONY: help install dev build test lint clean docker-up docker-down k8s-deploy

help: ## Show this help message
@echo 'ThrottleX Monorepo - Available commands:'
@echo ''
@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
npm install

dev: ## Start all services in development mode
docker compose -f docker/docker-compose.dev.yml up -d redis
npm run dev:backend & npm run dev:frontend

dev-backend: ## Start backend only
npm run dev:backend

dev-frontend: ## Start frontend only
npm run dev:frontend

build: ## Build all packages
npm run build

build-backend: ## Build backend only
npm run build:backend

build-frontend: ## Build frontend only
npm run build:frontend

test: ## Run all tests
npm run test

test-backend: ## Run backend tests
npm run test:backend

test-frontend: ## Run frontend tests
npm run test:frontend

lint: ## Lint all packages
npm run lint

typecheck: ## Type-check all packages
npm run typecheck

clean: ## Clean build artifacts
rm -rf backend/dist frontend/dist shared/dist
rm -rf backend/node_modules frontend/node_modules shared/node_modules node_modules

docker-up: ## Start full stack with Docker
docker compose -f docker/docker-compose.yml up -d

docker-up-dev: ## Start development stack with Docker
docker compose -f docker/docker-compose.dev.yml up -d

docker-down: ## Stop all Docker services
docker compose -f docker/docker-compose.yml down

docker-build: ## Build all Docker images
bash scripts/docker/build-all.sh

k8s-deploy-dev: ## Deploy to dev Kubernetes
bash scripts/k8s/deploy-dev.sh

k8s-deploy-prod: ## Deploy to production Kubernetes
bash scripts/k8s/deploy-prod.sh

k8s-cleanup: ## Clean up Kubernetes resources
bash scripts/k8s/cleanup.sh

setup-dev: ## Set up development environment
bash scripts/setup/setup-dev.sh

init-monorepo: ## Initialize monorepo (first time setup)
bash scripts/setup/init-monorepo.sh
