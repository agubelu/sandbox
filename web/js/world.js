'use strict';

const canvas = document.getElementById('world');
let intervalHandle = null;
let fps = 60;

function updateWorld() {
    // TODO
}

function updateCanvas() {
    let ctx = canvas.getContext('2d');
    let id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = id.data;
    // Determine which pixels to update and use setPixel()
    ctx.putImageData(id, 0, 0);
}

function setPixel(pixels, index, r, g, b, a = 255) {
    let ix = index * 4;
    pixels[ix] = r;
    pixels[ix + 1] = g;
    pixels[ix + 2] = b;
    pixels[ix + 3] = a;
}

// Render control functions
function startRender() {
    intervalHandle = setInterval(updateWorld, 1 / fps * 1000);
}

function stopRender() {
    clearInterval(intervalHandle);
    intervalHandle = null;
}

setPixel(4999, 255, 100, 50);