use crate::Color;

#[derive(Copy, Clone)]
pub struct Particle {
    kind: ParticleKind,
    color: Color,
}

#[derive(Copy, Clone, PartialEq, Eq)]
pub enum ParticleKind {
    Sand,
}

impl Particle {
    pub fn new(kind: ParticleKind) -> Self {
        Self { kind, color: Color::for_particle(kind) }
    }
}
