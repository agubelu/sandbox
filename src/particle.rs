use wasm_bindgen::prelude::*;

use crate::{Color, Sandbox};

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Particle {
    pub kind: ParticleKind,
    pub color: Color,
}

#[wasm_bindgen]
#[derive(Copy, Clone, PartialEq, Eq)]
pub enum ParticleKind {
    Empty = 0,
    Sand = 1,
    Wall = 2,
}

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    pub fn new(kind: ParticleKind) -> Self {
        Self { kind, color: Color::for_particle(kind) }
    }

    pub fn empty() -> Self {
        Self { kind: ParticleKind::Empty, color: Color::default() }
    }

    /// Asks the particle to update its position based on its current position and the world information.
    /// If the particle wants to move, returns `Some(new_position)``.
    pub fn update(&mut self, pos: usize, world: &Sandbox) -> Option<usize> {
        match self.kind {
            ParticleKind::Empty => None,
            ParticleKind::Sand => self.update_sand(pos, world),
            ParticleKind::Wall => None,
        }
    }

    // Particle-specific update logic
    fn update_sand(&mut self, pos: usize, world: &Sandbox) -> Option<usize> {
        // Sand tries to fall down, down-left and down-right.
        if world.is_free_down(pos) {
            Some(pos + world.width())
        } else if world.is_free_down_left(pos) {
            Some(pos + world.width() - 1)
        } else if world.is_free_down_right(pos) {
            Some(pos + world.width() + 1)
        } else {
            None
        }
    }
}
