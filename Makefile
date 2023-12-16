APP_VERSION=1.0.0
ILJOURNALIER_SERVER_HOST_DEV=http://localhost:24610
ILJOURNALIER_SERVER_HOST_PROD=https://caroline-weisberg.fun
USE_ILJOURNALIER_SERVER=

.PHONY: build

default: build open

build: buildDev

prod: buildProd open

buildDev:
	APP_VERSION=$(APP_VERSION) \
	ILJOURNALIER_SERVER_HOST=$(ILJOURNALIER_SERVER_HOST_DEV) \
	USE_ILJOURNALIER_SERVER=$(USE_ILJOURNALIER_SERVER) \
	npx webpack --config builddev.config.js

buildProd:
	APP_VERSION=$(APP_VERSION) \
	ILJOURNALIER_SERVER_HOST=$(ILJOURNALIER_SERVER_HOST_DEV) \
	USE_ILJOURNALIER_SERVER=$(USE_ILJOURNALIER_SERVER) \
	npx webpack --config buildprod.config.js

open:
	open ./build/index.html

serve:
	APP_VERSION=$(APP_VERSION) \
	ILJOURNALIER_SERVER_HOST=$(ILJOURNALIER_SERVER_HOST_DEV) \
	USE_ILJOURNALIER_SERVER=$(USE_ILJOURNALIER_SERVER) \
	npx webpack serve --config builddev.config.js

servehttp:
	APP_VERSION=$(APP_VERSION) \
	ILJOURNALIER_SERVER_HOST=$(ILJOURNALIER_SERVER_HOST_DEV) \
	USE_ILJOURNALIER_SERVER=$(USE_ILJOURNALIER_SERVER) \
	npx webpack serve --config builddev.config.nohttpsdevserver.js

archive: buildProd serviceworker-prod
	zip -vr archive/iljournalierweb-$(APP_VERSION).zip build/ -x "*.DS_Store"

serviceworker:
	APP_VERSION=$(APP_VERSION) MODE=development npx webpack --config serviceworker.config.js

serviceworker-prod:
	APP_VERSION=$(APP_VERSION) MODE=production npx webpack --config serviceworker.config.js

clean:
	rm -rf ./build/*