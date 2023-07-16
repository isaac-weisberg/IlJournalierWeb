.PHONY: build

default: build open

build: buildDev

prod: buildProd open

buildDev:
	npx webpack --config builddev.config.js

buildProd:
	npx webpack --config buildprod.config.js

open:
	open ./build/index.html

serve:
	npx webpack serve --https --config builddev.config.js

archive: buildProd index
	zip -vr build.zip build/ -x "*.DS_Store"

clean:
	rm -rf ./build/