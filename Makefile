build:
	rm -rf out
	mkdir out
	./node_modules/.bin/babel --optional runtime --loose all index.js --out-file out/script.js
	./node_modules/.bin/node-sass --precision 8 _index.scss out/style.css
	postcss --use autoprefixer --output out/style.css out/style.css