default: build

build:
	@ wasm-pack build --release --target web
	@ cp pkg/sandbox.js web/js/engine.js
	@ cp pkg/sandbox_bg.wasm web/js/
