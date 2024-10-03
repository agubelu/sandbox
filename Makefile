default: build

build:
	@ wasm-pack build --target web
	@ cp pkg/sandbox.js pkg/sandbox_bg.wasm web/js/
