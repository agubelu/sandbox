use rand::Rng;
use wasm_bindgen::prelude::*;

use crate::{Color, Sandbox, kind_matches};
use ParticleKind::*;

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
    Water = 3,
}

#[wasm_bindgen]
impl Particle {
    #[wasm_bindgen(constructor)]
    pub fn new(kind: ParticleKind) -> Self {
        Self { kind, color: Color::for_particle(kind) }
    }

    pub fn empty() -> Self {
        Self { kind: Empty, color: Color::for_particle(Empty) }
    }

    /// Asks the particle to update its position based on its current position and the world information.
    /// If the particle wants to move, returns `Some(new_position)``.
    pub fn update(&mut self, pos: usize, world: &Sandbox) -> Option<usize> {
        match self.kind {
            Empty => None,
            Sand => self.update_sand(pos, world),
            Wall => None,
            Water => self.update_water(pos, world),
        }
    }

    // Particle-specific update logic
    fn update_sand(&mut self, pos: usize, world: &Sandbox) -> Option<usize> {
        // Sand tries to fall down, down-left and down-right.
        // It can go through emptiness or water.
        let down = pos + world.width();
        let down_left = down - 1;
        let down_right = down + 1;

        if world.is_bottom_row(pos) {
            return None;
        }

        if kind_matches!(world, down, Empty | Water) {
            return Some(down);
        } else if !world.is_left_col(pos) && kind_matches!(world, down_left, Empty | Water) {
            return Some(down_left);
        } else if !world.is_right_col(pos) && kind_matches!(world, down_right, Empty | Water) {
            return Some(down_right);
        }
        None
    }

    fn update_water(&mut self, pos: usize, world: &Sandbox) -> Option<usize> {
        let down = pos + world.width();
        let down_left = down - 1;
        let down_right = down + 1;
        let left = pos - 1;
        let right = pos + 1;

        let is_left_col = world.is_left_col(pos);
        let is_right_col = world.is_right_col(pos);

        if !world.is_bottom_row(pos) {
            if kind_matches!(world, down, Empty) {
                return Some(down);
            } else if !is_left_col && kind_matches!(world, down_left, Empty) {
                return Some(down_left);
            } else if !is_right_col && kind_matches!(world, down_right, Empty) {
                return Some(down_right);
            }
        }

        if !is_left_col && rand::thread_rng().gen::<f32>() < 0.5 && kind_matches!(world, left, Empty) {
            return Some(left);
        } else if !is_right_col && rand::thread_rng().gen::<f32>() < 0.5 && kind_matches!(world, right, Empty) {
            return Some(right);
        }
        None
    }
}


