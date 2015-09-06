/* jshint esnext: true */
let tbody = document.getElementsByTagName('tbody')[0];

function emptyTable () {
    const table = tbody.parentElement;
    tbody.remove();
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
}

function makeCell () {
    const cell = document.createElement('td');
    cell.className = 'cell';
    return cell;
}

function redrawGrid (width, height) {
    emptyTable();
    for (let i = 0; i < height; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < width; j++) {
            tr.appendChild(makeCell());
        }
        tbody.appendChild(tr);
    }
}

function drawInputtedGrid () {
    redrawGrid(window.parseInt(gwidth.value), window.parseInt(gheight.value));
}

gwidth.addEventListener('change', drawInputtedGrid, false);
gheight.addEventListener('change', drawInputtedGrid, false);
drawInputtedGrid();
