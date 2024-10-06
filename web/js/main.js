'use strict';

import initWasm, * as engine from './engine.js';
import { Sandbox } from "./sandbox.js";

let sandbox = null;
let brushes = null;

const SANDBOX_SIZE = [300, 300];
const BACKGROUND = [245, 227, 193];  // #f5e3c1
const clearBtn = document.getElementById('btn-clear');
const elemSelect = document.getElementById('elem-select');

async function main() {
    let wasm = await initWasm();
    initHandlers();
    initBrushes();
    sandbox = new Sandbox(wasm, engine, SANDBOX_SIZE[0], SANDBOX_SIZE[1]);
    sandbox.startSimulation();
};

function initBrushes() {
    let makeBrush = (radius, chance) => new engine.Brush(SANDBOX_SIZE[0], SANDBOX_SIZE[1], radius, chance);
    brushes = [
        makeBrush(3, 1.0), // Eraser
        makeBrush(5, 0.1), // Sand
        makeBrush(3, 1.0), // Wall
        makeBrush(5, 0.1), // Water
    ];
}

function initHandlers() {
    elemSelect.onchange = () => sandbox.setElement(elemSelect.value, brushes[elemSelect.value]);
    clearBtn.onclick = () => sandbox.clear();
}

main();

export { BACKGROUND };