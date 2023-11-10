APP_VERSION=0.11.0

.PHONY: build

default: build open

build: buildDev

prod: buildProd open

buildDev:
	APP_VERSION=$(APP_VERSION) npx webpack --config builddev.config.js

buildProd:
	APP_VERSION=$(APP_VERSION) npx webpack --config buildprod.config.js

open:
	open ./build/index.html

serve:
	APP_VERSION=$(APP_VERSION) npx webpack serve --config builddev.config.js

servehttp:
	APP_VERSION=$(APP_VERSION) npx webpack serve --config builddev.config.nohttpsdevserver.js

archive: buildProd serviceworker-prod
	zip -vr archive/iljournalierweb-$(APP_VERSION).zip build/ -x "*.DS_Store"

serviceworker:
	APP_VERSION=$(APP_VERSION) MODE=development npx webpack --config serviceworker.config.js

serviceworker-prod:
	APP_VERSION=$(APP_VERSION) MODE=production npx webpack --config serviceworker.config.js

clean:
	rm -rf ./build/*