include .env

all: up

up: ssl
	docker compose up --watch --build --remove-orphans --force-recreate

up-%: ssl
	docker compose up --build --detach --remove-orphans --force-recreate $*

restart: up # start already rebuilds and recreates the containers

restart-%: up-%

down:
	docker compose down --remove-orphans

down-%:
	docker compose down --remove-orphans $*

shell-%:
	docker compose exec $* bash

ssl:
	@if not exist ssl\localhost.pem (       \
		mkdir ssl 2>NUL                  && \
		cd ssl                           && \
		mkcert -install                  && \
		mkcert localhost                 && \
		echo SSL certificates generated     \
	) else (                                \
		echo SSL certificates already exist \
	)
