image:
	docker build --pull .

run:
	docker container rm -f rutui
	docker-compose up -d

run-dev:
  npm install --save --legacy-peer-deps
  ng serve -o

clean:
	docker container rm -f rutui
	docker image rm -f rutui_rut-frontend
