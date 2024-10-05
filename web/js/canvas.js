'use strict';

class Canvas {
    constructor(sandbox, width, height) {
        this.sandbox = sandbox;
        this.htmlCanvas = document.getElementById('canvas');
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;

        // Store this to avoid triggering GC collections on the hot update loop
        this.ctx = this.htmlCanvas.getContext('2d', {willReadFrequently: true});
    }

    clear() {
        this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }
}

export { Canvas };