use wasm_bindgen::prelude::*;

use crate::{Color, Sandbox};

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Particle {
    kind: ParticleKind,
    pub color: Color,
}

#[derive(Copy, Clone, PartialEq, Eq)]
pub enum ParticleKind {
    Sand,
    Wall,
}

impl Particle {
    pub fn new(kind: ParticleKind) -> Self {
        Self { kind, color: Color::for_particle(kind) }
    }

    /// Asks the particle to update its position based on its current position and the world information.
    /// If the particle wants to move, returns Some(new_position).
    pub fn update(&self, pos: usize, world: &Sandbox) -> Option<usize> {
        match self.kind {
            ParticleKind::Sand => update_sand(pos, world),
            ParticleKind::Wall => update_wall(pos, world),
        }
    }
}

// Particle-specific update logic

fn update_sand(pos: usize, world: &Sandbox) -> Option<usize> {
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

fn update_wall(_pos: usize, _world: &Sandbox) -> Option<usize> {
    None // Walls don't move
}