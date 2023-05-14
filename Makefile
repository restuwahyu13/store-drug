################################################
# APPLICATITON COMMAND
################################################

prod:
	npm run start

dev:
	npm run start:dev

build:
	npm run build

################################################
# DOCKER COMMAND
################################################

dcub:
	docker-compose up -d --build --remove-orphans

dcunb:
	docker-compose up -d --build --remove-orphans --no-deps

dcun:
	docker-compose up -d --remove-orphans --no-deps --no-build

dcd:
	docker-compose down

################################################
# DATABASE MIGRATION COMMAND
################################################


troll:
	npm run mig:rollback

tlist:
	npm run mig:list

trun:
	npm run mig:latest

tmake:
ifdef name
	npm run mig:make ${name}
endif

tconf:
	npm run seed:config

tseed:
	npm run seed:run