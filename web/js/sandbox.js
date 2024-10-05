'use strict';

import { Canvas } from "./canvas.js";
import { TouchLayer } from "./touch.js";

class Sandbox {
    constructor(engine, width, height) {
        this.backend = new engine.Sandbox(width, height);
        this.width = width;
        this.height = height;
        this.canvas = new Canvas(this, width, height);
        this.touchLayer = new TouchLayer(this);

        this.selectedElem = 1; // TODO: Replace with brush
        this.intervalHandle = null;
        this.isDrawing = false;
    }

    update() {
        if (this.isDrawing) {
            let mousePos = this.touchLayer.getMousePosition();
            // TODO: dynamic scaling
            let x = Math.floor(mousePos.x/2);
            let y = Math.floor(mousePos.y/2);
            this.backend.set_particle(x, y, this.selectedElem);
        }
        let changed = this.backend.update();
        if (changed.length == 0) {
            this.stopSimulation();
            return;
        }

        this.canvas.redraw(changed);
    }

    clear() {
        this.backend.clear();
        this.canvas.clear();
    }

    startSimulation() {
        this.intervalHandle = window.setInterval(() => this.update(), 10);
    }

    stopSimulation() {
        window.clearInterval(this.intervalHandle);
        this.intervalHandle = null;
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
        // The possible canvas sizes should maintain aspect ratio.
        // this.scaleFactor = this.canvas.htmlCanvas.width / this.width;
    }

    getParticle(ix) {
        return this.backend.get_particle(ix);
    }
}

export { Sandbox };