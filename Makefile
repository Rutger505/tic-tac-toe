include .env

all: up

up:
	docker compose up --watch --build --remove-orphans --force-recreate

up-%:
	docker compose up --build --detach --remove-orphans --force-recreate $*

restart: up # start already rebuilds and recreates the containers

restart-%: up-%

down:
	docker compose down --remove-orphans

down-%:
	docker compose down --remove-orphans $*

shell-%:
	docker compose exec $* bash
