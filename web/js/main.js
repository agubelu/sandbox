'use strict';

import initWasm, * as engine from './engine.js';
import { Sandbox } from "./sandbox.js";

// DOM elements
let sandbox = null;
const clearBtn = document.getElementById('btn-clear');
const elemSelect = document.getElementById('elem-select');

async function main() {
    let wasm = await initWasm();
    initHandlers();
    sandbox = new Sandbox(wasm, engine, 300, 300);
    sandbox.startSimulation();
};

function initHandlers() {
    elemSelect.onchange = () => sandbox.setElement(elemSelect.value);
    clearBtn.onclick = () => sandbox.clear();
}

main();
