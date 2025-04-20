import { Triangle, initTriangle } from './triangle.js';
import { drawTriangle, canvas_xy } from './draw.js';

const canvas = document.getElementById('canvas');
const sizeSlider = document.querySelector('input[type="range"]');

const dpr = window.devicePixelRatio;
const width = ~~(canvas.getAttribute('width')) || 400;
const height = ~~(canvas.getAttribute('height')) || 400;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;
canvas.width = Math.floor(width * dpr);
canvas.height = Math.floor(height * dpr);
const ctx = canvas.getContext('2d');

let t = new Triangle(10);
initTriangle(t);
drawTriangle(ctx, t, height, dpr);

sizeSlider.addEventListener('input', () => {
    const newSize = ~~(sizeSlider.value);
    t = new Triangle(newSize);
    reset()
});

function reset() {
    initTriangle(t);
    drawTriangle(ctx, t, height, dpr);
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * dpr;
    const y = (event.clientY - rect.top) * dpr;
    const n = t.n;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i; j++) {
            const pos = canvas_xy(j, i, height, dpr);
            const d = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            //there must be a better way to do this, i cant be bothered
            if (d <= 10 * dpr) {
                let c = t.get(i, j)

                console.log(i, j);

                if (i + j == 0 || (i == n - 1 && j == 0) || (j == n - 1 && i == 0))
                    return
                else if (j == 0)
                    t.set(i, j, ~~(!c));
                else if (i == 0)
                    t.set(i, j, ~~(!(c - 1)) + 1);
                else if (i + j == n - 1)
                    t.set(i, j, ~~(!(c / 2)) * 2);
                else
                    t.set(i, j, (c + 1) % 3);

                drawTriangle(ctx, t, height, dpr);
            }
        }
    }
});

window.reset = reset;