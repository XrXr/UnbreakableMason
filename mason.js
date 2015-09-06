/* jshint esnext: true */
const tbody = document.getElementsByTagName('tbody')[0];
const HIGHLIGHT_CLASS = 'hover-highlight';
let highlighted = [];
let flipBrick = false;

function emptyTable () {
    for (let i = tbody.children.length - 1; i >= 0; i--) {
        tbody.children[i].remove();
    }
}

function cellHover (ev) {
    for (let cell of highlighted) {
        cell.classList.remove(HIGHLIGHT_CLASS);
    }

    const toFill = findCellsToFill(ev.target, window.parseInt(bwidth.value),
                                   window.parseInt(bheight.value));
    if (!toFill) {
        return;
    }
    highlighted = toFill.concat();
    for (let cell of toFill) {
        cell.classList.add(HIGHLIGHT_CLASS);
    }
}

function makeCell (x, y) {
    const cell = document.createElement('td');
    cell.className = 'cell';
    cell.masonPos = [x, y];
    cell.addEventListener('mouseover', cellHover);
    return cell;
}

function redrawGrid (width, height) {
    emptyTable();
    for (let i = 0; i < height; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < width; j++) {
            tr.appendChild(makeCell(j, i));
        }
        tbody.appendChild(tr);
    }
}

function getCell (x, y) {
    const row = tbody.children[y];
    if (!row) {
        return;
    }
    return row.children[x];
}

function findCellsVertically (store, topx, topy, height) {
    for (let i = 0; i < height; i++) {
        const cell = getCell(topx, topy + i);
        if (!cell) {
            return;
        }
        store.push(cell);
    }
    return true;
}

function findCellsToFill (origin, width, height, flip) {
    if (flip) {
        return findCellsToFill(origin, height, width);
    }

    const cells = [];
    const [ox, oy] = origin.masonPos;
    const topx = ox - Math.floor(width / 2);
    const topy = oy - Math.floor(height / 2);
    for (let i = 0; i < width; i++) {
        if (!findCellsVertically(cells, topx + i, topy, height)) {
            return;
        }
    }
    return cells;
}

function drawInputtedGrid () {
    redrawGrid(window.parseInt(gwidth.value), window.parseInt(gheight.value));
}

gwidth.addEventListener('change', drawInputtedGrid, false);
gheight.addEventListener('change', drawInputtedGrid, false);
bwidth.addEventListener('change', drawInputtedGrid, false);
bheight.addEventListener('change', drawInputtedGrid, false);
drawInputtedGrid();
