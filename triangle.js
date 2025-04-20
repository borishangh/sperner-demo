export class Triangle {
    constructor(n) {
        this.n = n;
        this.data = [];
        for (let i = n - 1; i >= 0; i--)
            this.data.push(Array(i + 1).fill(-1));
    }
    set(x, y, v) {
        this.data[y][x] = v;
    }
    get(x, y) {
        return this.data[y][x];
    }
    print() {
        let text = "";
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j <= i; j++)
                text += this.data[i][j] + " ";
            text += "\n";
        }
        return text;
    }
}

export function initTriangle(t) {
    const n = t.n;
    
    t.set(n - 1, 0, 0)
    t.set(0, 0, 1)
    t.set(0, n - 1, 2) // corners
    
    for (let i = 1; i < n - 1; i++) {
        t.set(i, 0, Math.random() < 0.5 ? 0 : 1)
        t.set(0, i, Math.random() < 0.5 ? 1 : 2)
        t.set(i, n - 1 - i, Math.random() < 0.5 ? 0 : 2) // sides
    }
    for (let i = 1; i < n - 2; i++) {
        for (let j = 1; j < n - 1 - i; j++)
            t.set(i, j, ~~(Math.random() * 3)) // interior
    }
}