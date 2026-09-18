export function initScribble(parent) {
    if (!parent) return { remove() {} }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    parent.appendChild(canvas)

    const NORTH = 0
    const NORTHEAST = 1
    const EAST = 2
    const SOUTHEAST = 3
    const SOUTH = 4
    const SOUTHWEST = 5
    const WEST = 6
    const NORTHWEST = 7

    let direction = 0
    let stepSize = 1
    let diameter = 1
    let posX = 0
    let posY = 0
    let drawMode = 1
    let counter = 0
    let pointerX = 80
    let running = true

    function resize() {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        posX = canvas.width / 2
        posY = canvas.height / 2
    }

    function onPointerMove(event) {
        pointerX = event.clientX
    }

    function hsbFill(h, s, b, a) {
        ctx.fillStyle = `hsla(${h}, ${s}%, ${b}%, ${a / 100})`
    }

    function step() {
        counter += 1

        if (drawMode === 2) {
            direction = Math.floor(Math.random() * 3)
        } else {
            direction = Math.floor(Math.random() * 7)
        }

        if (direction === NORTH) posY -= stepSize
        else if (direction === NORTHEAST) {
            posX += stepSize
            posY -= stepSize
        } else if (direction === EAST) posX += stepSize
        else if (direction === SOUTHEAST) {
            posX += stepSize
            posY += stepSize
        } else if (direction === SOUTH) posY += stepSize
        else if (direction === SOUTHWEST) {
            posX -= stepSize
            posY += stepSize
        } else if (direction === WEST) posX -= stepSize
        else if (direction === NORTHWEST) {
            posX -= stepSize
            posY -= stepSize
        }

        if (posX > canvas.width) posX = 0
        if (posX < 0) posX = canvas.width
        if (posY < 0) posY = canvas.height
        if (posY > canvas.height) posY = 0

        if (drawMode === 3 && counter >= 100) {
            counter = 0
            hsbFill(192, 100, 64, 80)
            ctx.beginPath()
            ctx.arc(
                posX + stepSize / 2,
                posY + stepSize / 2,
                (diameter + 7) / 2,
                0,
                Math.PI * 2
            )
            ctx.fill()
        }

        hsbFill(0, 40, 100, 40)
        ctx.beginPath()
        ctx.arc(
            posX + stepSize / 2,
            posY + stepSize / 2,
            diameter / 2,
            0,
            Math.PI * 2
        )
        ctx.fill()
    }

    function draw() {
        if (!running) return

        const steps = Math.max(80, pointerX)
        for (let i = 0; i <= steps; i += 1) step()

        requestAnimationFrame(draw)
    }

    window.addEventListener("mousemove", onPointerMove)
    window.addEventListener("resize", resize)
    resize()
    draw()

    return {
        remove() {
            running = false
            window.removeEventListener("mousemove", onPointerMove)
            window.removeEventListener("resize", resize)
            canvas.remove()
        },
    }
}
