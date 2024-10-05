use rand::Rng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Brush {
    max_x: i32,
    max_y: i32,
    radius: f32,
    chance: f32
}

#[wasm_bindgen]
pub struct Coord(pub i32, pub i32);

#[wasm_bindgen]
impl Brush {
    #[wasm_bindgen(constructor)]
    pub fn new(max_x: i32, max_y: i32, radius: i32, chance: f32) -> Self {
        Self { max_x, max_y, chance, radius: radius as f32  }
    }

    // Cursed return type
    pub fn stroke(&self, x: i32, y: i32) -> Vec<Coord> {
        let r = self.radius as i32;
        (x-r ..= x+r).flat_map(move |x| (y-r ..= y+r).map(move |y| (x, y)))
            .filter(|&p| self.in_circle_range(p, (x, y))) // In circle
            .filter(|&(x, y)| x >= 0 && x < self.max_x && y >= 0 && y < self.max_y) // In bounds
            .filter(|_| rand::thread_rng().gen::<f32>() <= self.chance) // Passes the chance %
            .map(|(x, y)| Coord(x, y)) // Can't return a straight tuple
            .collect()
    }

    fn in_circle_range(&self, (x1, y1): (i32, i32), (x2, y2): (i32, i32)) -> bool {
        (((x2 - x1).pow(2) + (y2 - y1).pow(2)) as f32).sqrt() <= self.radius
    }
}