use wasm_bindgen::prelude::*;

// Type definition and bindings for an HTML canvas 2D context, so we can use its relevant methods
// to print straight from the WASM side without having to cross the memory barrier back and forth.
// We could read WASM memory from JS alternatively, but it's a bit cumbersome
// because Particle isn't neatly aligned to a power of 2 bytes, so there would
// need to be a very strong coupling between its internal byte structure and
// the front-end code required to interpret and render it.
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen]
    pub type CanvasContext2D;

    #[wasm_bindgen(method, setter = fillStyle)]
    pub fn set_fill_color(this: &CanvasContext2D, color: &str);

    #[wasm_bindgen(method, js_name = fillRect)]
    pub fn fill_rect(this: &CanvasContext2D, x: usize, y: usize, width: usize, height: usize);

    #[wasm_bindgen(method, js_name = clearRect)]
    pub fn clear_rect(this: &CanvasContext2D, x: usize, y: usize, width: usize, height: usize);
}
