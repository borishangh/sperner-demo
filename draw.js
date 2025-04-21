export function drawTriangle(ctx, triangle, h, dpr) {
    const n = triangle.n;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "black"
    ctx.font = "40px Arial";
    ctx.fillText(`n = ${n}`, 10, 45);

    highlightTrichromatic(ctx, triangle, h, dpr);
    redBlueEdges(ctx, triangle, h, dpr);
    connectEdges(ctx, n, h, dpr);
    drawNodes(ctx, triangle, h, dpr);
}

export function canvas_xy(x, y, h, dpr, a = 60, origin = [40, 40]) {
    const pos_x = (x + 0.5 * y) * a + origin[0];
    const pos_y = h - ((0.866 * y) * a + origin[1]);
    return { x: pos_x * dpr, y: pos_y * dpr };
}

function connectEdges(ctx, n, h, dpr) {
    for (let x = 0; x < n - 1; x++) {
        drawEdge(ctx, [x, 0], [x, n - x - 1], h, dpr);
        drawEdge(ctx, [0, x], [n - x - 1, x], h, dpr);
        drawEdge(ctx, [n - 1 - x, 0], [0, n - 1 - x], h, dpr);
    }
}

function drawEdge(ctx, v1, v2, h, dpr) {
    ctx.strokeStyle = "rgb(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;
    const start = canvas_xy(...v1, h, dpr);
    const end = canvas_xy(...v2, h, dpr);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function drawNodes(ctx, triangle, h, dpr) {
    const n = triangle.n;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i; j++) {
            drawVertex(ctx, j, i, triangle.data[j][i], h, dpr);
        }
    }
}

function drawVertex(ctx, x, y, col, h, dpr) {
    const radius = 10 * dpr;
    const pos = canvas_xy(x, y, h, dpr);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = getColor(col);
    ctx.strokeStyle = 'black';
    ctx.fill();
    ctx.stroke();
}

function getColor(col) {
    return {
        '-1': 'white',
        0: 'red',
        1: 'blue',
        2: 'green'
    }[col] || 'black';
}

export function highlightTrichromatic(ctx, triangle, h, dpr) {
    const n = triangle.n;

    function check(coords) {
        for (const [x, y] of coords) {
            if (x < 0 || y < 0 || x + y >= n) return;
        }

        const colors = coords.map(([x, y]) => triangle.get(x, y));

        if (new Set(colors).size === 3 && colors.every(c => c >= 0)) {
            const [p1, p2, p3] = coords.map(([x, y]) => canvas_xy(y, x, h, dpr));

            let cx = (p1.x + p2.x + p3.x) / 3
            let cy = (p1.y + p2.y + p3.y) / 3

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();
        }
    }

    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n - y; x++) {
            check([[x, y], [x + 1, y], [x, y + 1]]);
            check([[x, y], [x - 1, y + 1], [x, y + 1]]);
        }
    }
}

function redBlueEdges(ctx, t, h, dpr) {

    const a1 = canvas_xy(0, 0, h, dpr)
    const a2 = canvas_xy(0, 1, h, dpr)
    const a3 = canvas_xy(1, 0, h, dpr)

    const dx = (a1.x + a2.x + a3.x) / 3 - a1.x //37.5
    const dy = (a1.y + a2.y + a3.y) / 3 - a1.y //-21.65


    const edges = [
        { check: (y, x) => [t.get(y, x), t.get(y + 1, x)], deltas: [-dx, dy] },
        { check: (y, x) => [t.get(y, x + 1), t.get(y + 1, x)], deltas: [dx, dy] },
        { check: (y, x) => [t.get(y, x), t.get(y, x + 1)], deltas: [0, -2 * dy] }
    ];

    ctx.strokeStyle = "purple";
    ctx.lineWidth = 2;

    for (let y = 0; y < t.n; y++) {
        for (let x = 0; x < t.n - y - 1; x++) {
            const { x: cx, y: cy } = canvas_xy(x, y, h, dpr);
            edges.forEach(({ check, deltas }) => {
                const [a, b] = check(y, x);
                if ((a === 0 && b === 1) || (a === 1 && b === 0)) {
                    ctx.beginPath();
                    ctx.moveTo(cx + dx, cy + dy);
                    ctx.lineTo(cx + dx + deltas[0], cy + dy + deltas[1]);
                    ctx.stroke();
                }
            });
        }
    }
}