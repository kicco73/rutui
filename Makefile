image:
	docker build --pull .

run:
	docker container rm -f rutui
	docker-compose up -d

clean:
	docker container rm -f rutui
	docker image rm -f rutui_rut-frontend
