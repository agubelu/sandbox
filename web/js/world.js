'use strict';
import initSandbox, * as sandbox from './sandbox.js';

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
    if (drawing) {
        getSpawnCoordinates().forEach(([x, y]) => world.set_particle(x, y, selectedElem));
    }
    let changed = world.update();
    document.getElementById('frame-counter').textContent = frames++;

    if (changed.length == 0) {
        stopRender();
        return;
    }

    redrawCanvas(changed);
}

function redrawCanvas(indexes) {
    let ctx = canvas.getContext('2d');
    let id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = id.data;

    for (let ix of indexes) {
        let particle = world.get_particle(ix);
        let color = particle.color;
        setPixel(pixels, ix, color.r, color.g, color.b, particle.kind !== 0 ? 255 : 0);
    }

    ctx.putImageData(id, 0, 0);
}

function setPixel(pixels, index, r, g, b, a) {
    let ix = index * 4;
    pixels[ix] = r;
    pixels[ix + 1] = g;
    pixels[ix + 2] = b;
    pixels[ix + 3] = a;
}

// Render control functions
function startRender() {
    intervalHandle = setInterval(updateWorld, 1 / 60 * 1000);
}

function stopRender() {
    clearInterval(intervalHandle);
    intervalHandle = null;
}

// Event handlers
function drawingStart(ev) {
    drawing = true;
    if (intervalHandle == null) startRender();
    mousePos = getMousePos(canvas, ev);
}

function drawingEnd(ev) {
    drawing = false;
}

elemSelect.onchange = () => selectedElem = elemSelect.value;

document.getElementById('btn-reset').onclick = () => {
    world.clear();
    canvas.getContext('2d').clearRect(0, 0, world.width(), world.height());
}

canvas.addEventListener('mousedown', drawingStart, false);
canvas.addEventListener('mouseup', drawingEnd, false);
canvas.addEventListener('mouseleave', drawingEnd, false);
canvas.addEventListener('mousemove', ev => mousePos = getMousePos(canvas, ev), false);

// Touch support
canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var me = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(me);
}, false);

canvas.addEventListener("touchstart", function (e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var me = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(me);
}, false);

canvas.addEventListener("touchend", function (e) {
    var me = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(me);
}, false);

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, { passive: false }, false);

document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, { passive: false }, false);

document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, { passive: false }, false);

// Other stuff
function getMousePos(canvasDom, mouseEvent) {
    let rect = canvasDom.getBoundingClientRect();
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
    }
}

function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    }
}

function getSpawnCoordinates() {
    // Calculates which positions to spawn particles in
    // according to the current mouse mosition.
    // Every spot in-bounds and in a 2 pixel radius
    // has a 50% chance to spawn a particle.
    let [x, y] = [Math.floor(mousePos.x / 6), Math.floor(mousePos.y / 6)]; // TODO dynamic scaling
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