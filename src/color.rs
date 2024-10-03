use crate::ParticleKind::{self, *};

#[derive(Copy, Clone, PartialEq, Eq)]
pub struct Color {
    pub r: u8,
    pub g: u8,
    pub b: u8,
}

impl Color {
    pub fn for_particle(particle: ParticleKind) -> Self {
        let (r, g, b) = match particle {
            Sand => (252, 186, 3),  // #FBBA03
        };
        Self { r, g, b }
    }
}