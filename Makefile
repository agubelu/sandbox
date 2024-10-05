default: build

build:
	@ wasm-pack build --target web
	@ cp pkg/sandbox.js web/js/engine.js
	@ cp pkg/sandbox_bg.wasm web/js/
