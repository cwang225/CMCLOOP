export function initBackground() {
    const canvas = document.querySelector("#background")
    const heartCanvas = document.querySelector("#heart-layer")
    const hero = document.querySelector(".hero")
    if (!canvas || !hero) return

    const ctx = canvas.getContext("2d")
    const heartCtx = heartCanvas?.getContext("2d")
    let ripples = []
    let hearts = []
    let heartOrigin = null
    let heartBeat = 0

    function resize() {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        if (heartCanvas) {
            heartCanvas.width = heartCanvas.offsetWidth
            heartCanvas.height = heartCanvas.offsetHeight
        }
    }

    function pointOn(target, event) {
        const bounds = target.getBoundingClientRect()
        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
        }
    }

    function hslToRgb(h, s, l) {
        s /= 100
        l /= 100
        const k = (n) => (n + h / 30) % 12
        const a = s * Math.min(l, 1 - l)
        const f = (n) =>
            l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
        return {
            r: Math.round(255 * f(0)),
            g: Math.round(255 * f(8)),
            b: Math.round(255 * f(4)),
        }
    }

    function rippleColor(ripple) {
        const rainbow = hslToRgb(ripple.hue, 85, 62)
        return `rgba(${rainbow.r},${rainbow.g},${rainbow.b},${ripple.opacity})`
    }

    function drawHeart(target, x, y, size, opacity) {
        const s = size
        target.save()
        target.translate(x, y)
        target.beginPath()
        target.moveTo(0, s * 0.2)
        target.bezierCurveTo(0, -s * 0.35, -s, -s * 0.35, -s, s * 0.1)
        target.bezierCurveTo(-s, s * 0.55, 0, s * 0.95, 0, s * 1.15)
        target.bezierCurveTo(0, s * 0.95, s, s * 0.55, s, s * 0.1)
        target.bezierCurveTo(s, -s * 0.35, 0, -s * 0.35, 0, s * 0.2)
        target.closePath()
        target.fillStyle = `rgba(220, 32, 48, ${opacity})`
        target.fill()
        target.restore()
    }

    function isOverAboutImage(event) {
        const underCursor = document.elementFromPoint(event.clientX, event.clientY)
        return Boolean(
            event.target?.closest?.(".about-image, .about-image-wrap") ||
            underCursor?.closest?.(".about-image, .about-image-wrap")
        )
    }

    function addCircle(x, y) {
        ripples.push({
            x,
            y,
            radius: 0,
            opacity: 1,
            hue: (performance.now() / 12 + x * 0.35) % 360,
        })
    }

    function addHeart(x, y) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.35 + Math.random() * 0.9
        hearts.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 13 + Math.random() * 5,
            opacity: 1,
        })
    }

    window.addEventListener("mousemove", (event) => {
        if (!canvas.width || !canvas.height) return

        if (isOverAboutImage(event) && heartCanvas) {
            heartOrigin = pointOn(heartCanvas, event)
            return
        }

        heartOrigin = null
        const point = pointOn(canvas, event)
        addCircle(point.x, point.y)
    })

    document.querySelector(".about-image")?.addEventListener("mouseleave", () => {
        heartOrigin = null
    })

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        heartCtx?.clearRect(0, 0, heartCanvas.width, heartCanvas.height)

        if (heartOrigin && heartCanvas) {
            heartBeat += 1
            if (heartBeat % 10 === 0) {
                addHeart(heartOrigin.x, heartOrigin.y)
            }
        } else {
            heartBeat = 0
        }

        ripples.forEach((ripple) => {
            ctx.beginPath()
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
            ctx.strokeStyle = rippleColor(ripple)
            ctx.lineWidth = 2
            ctx.stroke()
            ripple.radius += 3.5
            ripple.opacity -= 0.01
            ripple.hue = (ripple.hue + 1.4) % 360
        })

        hearts.forEach((heart) => {
            if (!heartCtx) return
            drawHeart(heartCtx, heart.x, heart.y, heart.size, heart.opacity)
            heart.x += heart.vx
            heart.y += heart.vy
            heart.opacity -= 0.0045
        })

        ripples = ripples.filter((ripple) => ripple.opacity > 0)
        hearts = hearts.filter((heart) => heart.opacity > 0)
        requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    new ResizeObserver(resize).observe(canvas)
    if (heartCanvas) new ResizeObserver(resize).observe(heartCanvas)
    const site = document.querySelector("#site")
    if (site) new ResizeObserver(resize).observe(site)
    resize()
    animate()
}
