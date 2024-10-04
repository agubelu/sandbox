'use strict';

class TouchLayer {
    constructor(sandbox) {
        this.div = document.getElementById('touch-layer');
        this.sandbox = sandbox;
        this.mousePosition = null;
        this.initializeListeners();
    }

    getMousePosition() {
        return this.mousePosition;
    }

    updateDrawing(isDrawing) {
        this.sandbox.setDrawing(isDrawing);
    }

    updatePositionMouse(event) {
        // Updates mousePosition from a mouse event
        let rect = this.div.getBoundingClientRect();
        this.mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    updatePositionTouch(event) {
        let rect = this.div.getBoundingClientRect();
        let touch = event.touches[0];
        this.mousePosition = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        // Touch events have no 'leave' equivalent, so we have to detect
        // if the touch is outside the div to stop drawing.
        if (touch.clientX < rect.left || touch.clientX > rect.right || touch.clientY < rect.top || touch.clientY > rect.bottom) {
            this.updateDrawing(false);
        }
    }

    initializeListeners() {
        // Mouse events
        this.div.addEventListener('mousedown', ev => {
            this.updateDrawing(true);
            this.updatePositionMouse(ev);
        }, false);
        this.div.addEventListener('mouseup', () => this.updateDrawing(false), false);
        this.div.addEventListener('mouseleave', () => this.updateDrawing(false), false);
        this.div.addEventListener('mousemove', ev => this.updatePositionMouse(ev), false);

        // Touch events
        this.div.addEventListener('touchstart', ev => {
            this.updateDrawing(true);
            this.updatePositionTouch(ev);
        }, false);
        this.div.addEventListener('touchend', () => this.updateDrawing(false), false);
        this.div.addEventListener('touchmove', ev => this.updatePositionTouch(ev), false);

        // Prevent scrolling when touching the canvas
        let stopPropagation = ev => { if (ev.target == this.div) ev.preventDefault(); };
        this.div.addEventListener('touchstart', stopPropagation, { passive: false }, false);
        this.div.addEventListener('touchend', stopPropagation, { passive: false }, false);
        this.div.addEventListener('touchmove', stopPropagation, { passive: false }, false);
    }
}

export { TouchLayer };