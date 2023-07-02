.PHONY: build


default: build open

build: buildDev copyIndexHtml

prod: buildProd copyIndexHtml open

buildDev:
	npx webpack --config builddev.config.js

buildProd:
	npx webpack --config buildprod.config.js

copyIndexHtml:
	cp ./src/index.html ./build/index.html

open:
	open ./build/index.html
	

serve:
	npx webpack serve --config builddev.config.js