use std::collections::HashSet;

use crate::Particle;

pub struct Sandbox {
    width: usize,
    height: usize,
    world: Vec<Option<Particle>>,
}

impl Sandbox {
    pub fn new(width: usize, height: usize) -> Self {
        let world = vec![None; width * height];
        Self { width, height, world }
    }

    /// Returns whatever is in the provided index. Panics if the index is OOB.
    pub fn get_particle(&self, ix: usize) -> Option<Particle> {
        self.world[ix]
    }

    /// Advances the world forward a single step. Returns a set with the index of all particles that have changed.
    pub fn update(&mut self) -> HashSet<usize> {
        todo!()
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Auxiliary methods to deal with internal positions

    /// Whether the provided index is in the first (top-most) row of the world.
    pub fn is_top_row(&self, ix: usize) -> bool {
        ix < self.width
    }

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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Internal methods

    fn swap_places(&mut self, a: usize, b: usize) {
        self.world.swap(a, b);
    }
}
