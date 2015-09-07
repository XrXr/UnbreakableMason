/* jshint esnext: true */
const tbody = document.getElementsByTagName('tbody')[0];
const HOVER_CLASS = 'hover-highlight';
const HIGHLIGHT_CLASS = 'laid-brick';

let highlighted = [];
let flipBrick = false;
let lastOrigin;

function emptyTable () {
    for (let i = tbody.children.length - 1; i >= 0; i--) {
        tbody.children[i].remove();
    }
}

function dehighlight () {
    for (let cell of highlighted) {
        cell.classList.remove(HOVER_CLASS);
    }
    highlighted = [];
}

function cellHover (ev) {
    dehighlight();
    const toFill = findCellsToFill(ev.target, window.parseInt(bwidth.value),
                                   window.parseInt(bheight.value), flipBrick);
    if (!toFill) {
        return;
    }
    highlighted = toFill.concat();
    for (let cell of toFill) {
        cell.classList.add(HOVER_CLASS);
    }
    lastOrigin = ev.target;
}

function layBrick () {
    if (highlighted.some(node => node.classList.contains(HIGHLIGHT_CLASS))) {
        return;
    }

    for (let cell of highlighted) {
        cell.classList.add('laid-brick');
        cell.classList.add('no-border');
    }

    let width = window.parseInt(bwidth.value);
    let height = window.parseInt(bheight.value);
    if (flipBrick) {
        [width, height] = [height, width];
    }
    const len = highlighted.length;

    for (let i = 0; i < len; i += height) {
        highlighted[i].classList.add('seal-top');
    }

    for (let i = height - 1; i < len; i += height) {
        highlighted[i].classList.add('seal-bottom');
    }

    for (let i = 0; i < height; i++) {
        highlighted[i].classList.add('seal-left');
    }

    for (let i = len - height; i < len; i++) {
        highlighted[i].classList.add('seal-right');
    }
}

function makeLayer () {
    const div = document.createElement('div');
    div.classList.add('layer');
    return div;
}

function makeCell (x, y) {
    const cell = document.createElement('td');
    cell.className = 'cell';
    cell.masonPos = [x, y];
    cell.addEventListener('mouseover', cellHover, true);
    cell.addEventListener('click', layBrick, true);

    cell.appendChild(makeLayer());
    cell.appendChild(makeLayer());
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

    while (origin.tagName !== 'TD') {
        origin = origin.parentElement;
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

function reset () {
    dehighlight();
    redrawGrid(window.parseInt(gwidth.value), window.parseInt(gheight.value));
}

gwidth.addEventListener('change', reset, false);
gheight.addEventListener('change', reset, false);
bwidth.addEventListener('change', reset, false);
bheight.addEventListener('change', reset, false);

window.addEventListener('keydown', function (ev) {
    if (ev.key === 'Tab') {
        ev.preventDefault();
        ev.stopPropagation();
        dehighlight();
        flipBrick = !flipBrick;
        if (lastOrigin) {
            cellHover({
                target: lastOrigin
            });
        }
    } else if (ev.key === 'Escape') {
        dehighlight();
    }
}, true);

reset();
