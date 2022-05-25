// Inicialización de globales
const sc = document.getElementById("score")
const c = document.getElementById("cnv")
const ctx = c.getContext("2d")
const gW = c.width / 7
const gH = c.height / 7
const r = gW * 0.8 / 2
const board = new Array(7)
let selected = false
let xS = -1
let yS = -1
let outOfBounds = false
let score = 0

// Inicialización puntuación
sc.innerHTML = score

// Inicialización matrix traspuesta (debe ser traspuesta ya que las coordenadas de una matriz y el canvas están traspuestas)
for (let x = 0; x < 7; x++) {
    board[x] = Array(7)
    for (let y = 0; y < 7; y++) {
        board[x][y] = {}
    }
}


// Renderizado inicial tablero
for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 7; y++) {
        outOfBounds = (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4) || (x > 4 && y > 4)

        if (!outOfBounds) {
            draw(x, y, 'red')
            board[y][x] = { active: true, empty: false }
        } else {
            board[y][x] = { active: false, empty: true }
        }
    }

}

// Punto de inicio
do {
    const x = random(6)
    const y = random(6)

    outOfBounds = (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4) || (x > 4 && y > 4)

    if (!outOfBounds) {
        draw(x, y, 'white')
        board[x][y].empty = true
    }

} while (outOfBounds)

c.addEventListener("click", (ev) => {
    select(c, ev)
})

function random(n) {
    return Math.floor(Math.random() * (n + 1))
}


function select(canvas, event) {

    // Conseguimos las coordenadas de la casilla clickada
    const rect = canvas.getBoundingClientRect()
    const left = event.clientX - rect.left
    const top = event.clientY - rect.top

    const [x, y] = [Math.floor(left / gW), Math.floor(top / gH)]

    // Si es la primera selección, comprobamos que es una ficha y la resaltamos
    // Si es la segunda selección, movemos la ficha
    if (!selected && !board[x][y].empty) {
        draw(x, y, '#ffff00')
        xS = x
        yS = y
        selected = true
    } else {
        move(x, y)
    }
}

function draw(x, y, hex) {
    ctx.fillStyle = hex
    ctx.beginPath();
    ctx.arc(gH / 2 + x * gH, gW / 2 + y * gW, r, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.fill()
}

function move(x, y) {
    // La posición no puede ser una ficha inexistente

    outOfBounds = (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4) || (x > 4 && y > 4)
    if (outOfBounds) return

    // La distancia a la que puede saltar una ficha debe ser exactamente 2

    const sides = Math.pow(x - xS, 2) + Math.pow(y - yS, 2)
    const dist = Math.sqrt(sides)

    if (dist !== 2) return

    // Se calcula el punto medio para comprobar que hay una ficha

    const xM = (x + xS) / 2
    const yM = (y + yS) / 2

    const isEmpty = board[xM][yM].empty

    if (isEmpty) return

    // Se comprueba que la ficha va a saltar a un lugar vacío

    if (!board[x][y].empty) return

    /* Una vez pasa todos los controles, se mueve la ficha a su nueva posición y se dejan los huecos vacíos */

    // Vaciado de la casilla seleccionada
    draw(xS, yS, 'white')
    board[xS][yS].empty = true

    // Vaciado de la casilla intermedia
    draw(xM, yM, 'white')
    board[xM][yM].empty = true

    // Rellenado de la nueva posición
    draw(x, y, 'red')
    board[x][y].empty = false

    score++
    sc.innerHTML = score
    selected = false
}