.PHONY: build


default: build open

build: buildDev index

prod: buildProd index open

buildDev:
	npx webpack --config builddev.config.js

buildProd:
	npx webpack --config buildprod.config.js

index:
	cp ./src/index.html ./build/index.html

open:
	open ./build/index.html
	

serve:
	npx webpack serve --config builddev.config.js

archive: buildProd
	zip -vr build.zip build/ -x "*.DS_Store"