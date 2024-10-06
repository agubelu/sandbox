'use strict';

import { BACKGROUND } from './main.js';

class Canvas {
    constructor(sandbox, width, height) {
        this.sandbox = sandbox;
        this.htmlCanvas = document.getElementById('canvas');
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;

        // Store stuff to avoid triggering GC collections on the hot update loop
        this.ctx = this.htmlCanvas.getContext('2d', { willReadFrequently: true, alpha: false });
        this.clear();
        this.initializeListeners();
    }

    update() {
        this.ctx.putImageData(this.imgData, 0, 0);
    }

    clear() {
        this.imgData = this.newImgData();
        this.imgDataBytes = this.imgData.data;
        this.update();
    }

    initializeListeners() {
        // Update the scale ratio when the physical size of the canvas changes
        let observer = new ResizeObserver(_ => this.sandbox.updateScaleFactor());
        observer.observe(this.htmlCanvas);
    }

    newImgData() {
        let imgData = this.ctx.createImageData(this.htmlCanvas.width, this.htmlCanvas.height);
        for (let i = 0; i < this.htmlCanvas.width * this.htmlCanvas.height; i++) {
            let ix = i * 4;
            imgData.data[ix] = BACKGROUND[0];
            imgData.data[ix+1] = BACKGROUND[1];
            imgData.data[ix+2] = BACKGROUND[2];
            imgData.data[ix+3] = 255;
        }
        return imgData;
    }
}

export { Canvas };
