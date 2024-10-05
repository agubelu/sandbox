'use strict';

import { Canvas } from "./canvas.js";
import { TouchLayer } from "./touch.js";

class Sandbox {
    constructor(wasm, engine, width, height) {
        this.backend = new engine.Sandbox(width, height);
        this.wasmMemory = wasm.memory;

        this.width = width;
        this.height = height;
        this.canvas = new Canvas(this, width, height);
        this.touchLayer = new TouchLayer(this);

        this.selectedElem = 1; // TODO: Replace with brush
        this.isDrawing = false;
        this.updateScaleFactor();
    }

    update() {
        if (this.isDrawing) {
            let mousePos = this.touchLayer.getMousePosition();
            let x = Math.floor(mousePos.x / this.scaleFactor);
            let y = Math.floor(mousePos.y / this.scaleFactor);
            this.backend.set_particle(x, y, this.selectedElem);
        }

        let ctx = this.canvas.ctx;
        if (this.backend.update(ctx)) {
            window.requestAnimationFrame(() => this.update());
        }
    }

    clear() {
        this.backend.clear();
        this.canvas.clear();
    }

    startSimulation() {
        window.requestAnimationFrame(() => this.update());
    }

    setDrawing(isDrawing) {
        this.isDrawing = isDrawing;
        if (isDrawing) {
            this.startSimulation();
        }
    }

    setElement(element) {
        // TODO: replace with brush
        this.selectedElem = element;
    }

    updateScaleFactor() {
        // Updated when the canvas gets resized.
        // Assumes that both the canvas and the world are squares.
        // If not, you'll have to decouple the scale for each axis.
        let worldWidth = this.width;
        let canvasWidth = this.canvas.htmlCanvas.clientWidth;
        this.scaleFactor = canvasWidth / worldWidth;
    }

    getParticle(ix) {
        return this.backend.get_particle(ix);
    }
}

export { Sandbox };