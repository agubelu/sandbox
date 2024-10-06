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

        this.selectedElem = 1;
        this.brush = new engine.Brush(width, height, 5, 0.2);
        this.isDrawing = false;
        this.updateScaleFactor();
    }

    update() {
        if (this.isDrawing) {
            let mousePos = this.touchLayer.getMousePosition();
            let mouseX = Math.floor(mousePos.x / this.scaleFactor);
            let mouseY = Math.floor(mousePos.y / this.scaleFactor);
            for (let coord of this.brush.stroke(mouseX, mouseY)) {
                let [x, y] = [coord[0], coord[1]];
                this.backend.set_particle(x, y, this.selectedElem);
            }
        }

        if (this.backend.update(this.canvas.imgDataBytes)) {
            this.canvas.update();
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

    setElement(element, brush) {
        this.selectedElem = element;
        this.brush = brush;
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
