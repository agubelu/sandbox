use rand::Rng;
use wasm_bindgen::prelude::*;

use crate::ParticleKind::{self, *};

#[wasm_bindgen]
#[derive(Copy, Clone, PartialEq, Eq)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl Color {
    pub fn for_particle(particle: ParticleKind) -> Self {
        let (r, g, b) = match particle  {
            Empty => return Self { r: 245, g: 227, b: 193 },
            Sand => (252, 186, 3),  // #FBBA03
            Wall => (74, 72, 71),  // #4a4847
            Water => (89, 155, 247),  // #599bf7
        };
        Self { r: randomize(r), g: randomize(g), b: randomize(b) }
    }
}

fn randomize(value: i16) -> u8 {
    (value + rand::thread_rng().gen_range(-10..10)).clamp(0, 255) as u8
}
