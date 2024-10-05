'use strict';

class Canvas {
    constructor(sandbox, width, height) {
        this.sandbox = sandbox;
        this.htmlCanvas = document.getElementById('canvas');
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;

        // Store this to avoid triggering GC collections on the hot update loop
        this.ctx = this.htmlCanvas.getContext('2d', { willReadFrequently: true });
        this.initializeListeners();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }

    initializeListeners() {
        // Update the scale ratio when the physical size of the canvas changes
        let observer = new ResizeObserver(_ => this.sandbox.updateScaleFactor());
        observer.observe(this.htmlCanvas);
    }
}

export { Canvas };