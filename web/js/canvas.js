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

    redraw(indexes) {
        let imageData = this.ctx.getImageData(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        let pixels = imageData.data;

        for (let ix of indexes) {
            let particle = this.sandbox.getParticle(ix);
            let pos = ix * 4;
            pixels[pos] = particle.color.r;
            pixels[pos + 1] = particle.color.g;
            pixels[pos + 2] = particle.color.b;
            pixels[pos + 3] = particle.kind !== 0 ? 255 : 0;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }
}

export { Canvas };