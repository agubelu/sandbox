use bitvec::prelude::*;
use rand::Rng;
use wasm_bindgen::prelude::*;

use crate::{Particle, ParticleKind::{self, *}};

#[wasm_bindgen]
pub struct Sandbox {
    width: usize,
    height: usize,
    world: Vec<Particle>,
}

#[macro_export]
macro_rules! kind_matches {
    ($world:ident, $ix:expr, $pat:pat) => {
        matches!($world.particle_type_at($ix), $pat)
    }
}

#[wasm_bindgen]
impl Sandbox {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> Self {
        let world = vec![Particle::empty(); width * height];
        Self { width, height, world }
    }

    /// Returns the particle type in a provided index. Panics if the index is OOB.
    pub fn particle_type_at(&self, ix: usize) -> ParticleKind {
       self.world[ix].kind
    }

    /// Adds a new particle to the world. Panics if the specified position is OOB.
    pub fn set_particle(&mut self, x: usize, y: usize, kind: ParticleKind, canvas: &mut[u8]) {
        assert!(x < self.width);
        assert!(y < self.height);
        let particle = Particle::new(kind);
        let ix = y * self.width + x;
        self.world[ix] = particle;
        self.draw(canvas, ix);
    }

    /// Advances the world forward a single step. Returns a list with the index of all particles that have changed.
    pub fn update(&mut self, canvas: &mut[u8]) -> bool {
        let mut updated = bitvec![0; self.world.len()];
        let mut changed = false;

        for y in (0..self.height).rev() {
            for x in self.iterate_row() { // TODO: optimize once the final logic is in place
                let ix = y * self.width + x;
                if updated[ix] {continue}
                let mut particle = self.world[ix];
                if particle.kind == Empty {
                    continue;
                }

                if let Some(new_ix) = particle.update(ix, self) {
                    changed = true;
                    self.swap_places(ix, new_ix);
                    self.world[new_ix] = particle;
                    self.draw(canvas, ix);
                    self.draw(canvas, new_ix);
                    updated.set(ix, true);
                    updated.set(new_ix, true);
                }
            }
        }

        changed
    }

    pub fn clear(&mut self) {
        *self = Self::new(self.width, self.height);
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.height
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Internal methods

    /// Returns an iterator over the offsets of a row, with a 50% chance of
    /// iterating first to last, and a 50% of being last to first.
    fn iterate_row(&self) -> Box<dyn Iterator<Item=usize>> {
        if rand::thread_rng().gen_bool(0.5) {
            Box::new(0..self.width)
        } else {
            Box::new((0..self.width).rev())
        }
    }

    fn draw(&self, canvas: &mut[u8], ix: usize) {
        let pos = ix * 4;
        let color = self.world[ix].color;
        canvas[pos] = color.r;
        canvas[pos + 1] = color.g;
        canvas[pos + 2] = color.b;
    }

    fn swap_places(&mut self, a: usize, b: usize) {
        self.world.swap(a, b);
    }

    /// Whether the provided index is in the first (top-most) row of the world.
    // fn is_top_row(&self, ix: usize) -> bool {
    //     ix < self.width
    // }

    /// Whether the provided index is in the last (bottom-most) row of the world.
    pub fn is_bottom_row(&self, ix: usize) -> bool {
        ix >= (self.height - 1) * self.width
    }

    /// Whether the provided index is in the first (left-most) column of the world.
    pub fn is_left_col(&self, ix: usize) -> bool {
        ix % self.width == 0
    }

    /// Whether the provided index is in the last (right-most) column of the world.
    pub fn is_right_col(&self, ix: usize) -> bool {
        ix % self.width == self.width - 1
    }
}
