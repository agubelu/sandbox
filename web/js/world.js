'use strict';
import initSandbox, * as sandbox from './engine.js';

// DOM elements
const canvas = document.getElementById('world');
const elemSelect = document.getElementById('elem-select');

// State variables
let frames = 0;
let selectedElem = 1;
let world = null;
let intervalHandle = null;
let drawing = false;
let mousePos = null;

function updateWorld() {
    
}




// Render control functions












function getSpawnCoordinates() {
    // Calculates which positions to spawn particles in
    // according to the current mouse mosition.
    // Every spot in-bounds and in a 2 pixel radius
    // has a 50% chance to spawn a particle.
    let [x, y] = [Math.floor(mousePos.x / 3), Math.floor(mousePos.y / 3)]; // TODO dynamic scaling
    let possible = [
        [x, y - 1],
        [x - 1, y], [x, y], [x + 1, y],
        [x, y + 1],
    ];
    let chance = selectedElem == 0 || selectedElem == 2 ? 1.0 : 0.3;
    return possible.filter(([x, y]) => Math.random() < chance && x >= 0 && y >= 0 && x < world.width() && y < world.height());
}

// Main
async function main() {
    await initSandbox();
    world = new sandbox.Sandbox(100, 50);
    // Add a bunch of random sand particles
    for (let x = 30; x <= 70; x++) {
        for (let y = 0; y <= 30; y++) {
            if (Math.random() < (1 - .1*Math.abs(50-x))) world.set_particle(x, y, 1);
        }
    }
    startRender();
}

main();