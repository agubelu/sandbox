'use strict';

import initSandbox, * as engine from './engine.js';
import { Sandbox } from "./sandbox.js";

// DOM elements
let sandbox = null;
const clearBtn = document.getElementById('btn-clear');
const elemSelect = document.getElementById('elem-select');

async function main() {
    await initSandbox();
    initHandlers();
    sandbox = new Sandbox(engine, 300, 150);
    sandbox.startSimulation();
};

function initHandlers() {
    elemSelect.onchange = () => sandbox.setElement(elemSelect.value);
    clearBtn.onclick = () => sandbox.clear();
}

main();
