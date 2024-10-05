use std::collections::HashSet;
use std::mem;
use wasm_bindgen::prelude::*;

use crate::{particle, CanvasContext2D, Particle, ParticleKind::{self, *}};

#[wasm_bindgen]
pub struct Sandbox {
    width: usize,
    height: usize,
    world: Vec<Particle>,
    added: HashSet<usize>,
}

#[wasm_bindgen]
impl Sandbox {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> Self {
        let world = vec![Particle::empty(); width * height];
        Self { width, height, world, added: HashSet::new() }
    }

    /// Returns whatever is in the provided index. Panics if the index is OOB.
    pub fn particles(&self) -> *const Particle {
       self.world.as_ptr()
    }

    /// Adds a new particle to the world. Panics if the specified position is OOB.
    pub fn set_particle(&mut self, x: usize, y: usize, kind: ParticleKind) {
        assert!(x < self.width);
        assert!(y < self.height);
        let particle = Particle::new(kind);
        let ix = y * self.width + x;
        self.world[ix] = particle;
        self.added.insert(ix);
    }

    /// Advances the world forward a single step. Returns a list with the index of all particles that have changed.
    pub fn update(&mut self, canvas: JsValue) -> bool {
        let mut changed = mem::take(&mut self.added); // Always render particles that have been added since the last update

        for ix in (0..(self.height*self.width)).rev() {
            let mut particle = self.world[ix];
            if particle.kind == Empty {
                continue;
            }

            if let Some(new_ix) = particle.update(ix, self) {
                self.swap_places(ix, new_ix);
                self.world[new_ix] = particle;
                changed.insert(ix);
                changed.insert(new_ix);
            }
        }

        // $DEITY help us if this isn't actually a canvas element
        let canvas_ctx = canvas.unchecked_into::<CanvasContext2D>();
        self.render(&canvas_ctx, &changed);
        !changed.is_empty()
    }

    fn render(&self, canvas: &CanvasContext2D, indexes: &HashSet<usize>) {
        for ix in indexes.iter().copied() {
            let x = ix % self.width;
            let y = ix / self.width;
            let particle = self.world[ix];

            if particle.kind == Empty {
                canvas.clear_rect(x, y, 1, 1);
            } else {
                canvas.set_fill_color(&particle.color.rgb_string());
                canvas.fill_rect(x, y, 1, 1);
            }
        }
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
    // Auxiliary methods for particles to query world positions

    // Whether the space under `ix` is free.
    pub(crate) fn is_free_down(&self, ix: usize) -> bool {
        !self.is_bottom_row(ix) && self.world[ix + self.width].kind == Empty
    }

    // Whether the space down and to the left of `ix` is free.
    pub(crate) fn is_free_down_left(&self, ix: usize) -> bool {
        !self.is_bottom_row(ix) && !self.is_left_col(ix) && self.world[ix + self.width - 1].kind == Empty
    }

    // Whether the space down and to the right of `ix` is free.
    pub(crate) fn is_free_down_right(&self, ix: usize) -> bool {
        !self.is_bottom_row(ix) && !self.is_right_col(ix) && self.world[ix + self.width + 1].kind == Empty
    }

    // Whether the space to the right of `ix` is free.
    pub(crate) fn is_free_right(&self, ix: usize) -> bool {
        !self.is_right_col(ix) && self.world[ix + 1].kind == Empty
    }

    // Whether the space to the left of `ix` is free.
    pub(crate) fn is_free_left(&self, ix: usize) -> bool {
        !self.is_left_col(ix) && self.world[ix - 1].kind == Empty
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Internal methods

    fn swap_places(&mut self, a: usize, b: usize) {
        self.world.swap(a, b);
    }

    /// Whether the provided index is in the first (top-most) row of the world.
    // fn is_top_row(&self, ix: usize) -> bool {
    //     ix < self.width
    // }

    /// Whether the provided index is in the last (bottom-most) row of the world.
    fn is_bottom_row(&self, ix: usize) -> bool {
        ix >= (self.height - 1) * self.width
    }

    /// Whether the provided index is in the first (left-most) column of the world.
    fn is_left_col(&self, ix: usize) -> bool {
        ix % self.width == 0
    }

    /// Whether the provided index is in the last (right-most) column of the world.
    fn is_right_col(&self, ix: usize) -> bool {
        ix % self.width == self.width - 1
    }
}
