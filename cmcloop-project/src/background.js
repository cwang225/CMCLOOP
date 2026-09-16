export function initBackground() {
    const canvas = document.querySelector("#background")
    const hero = document.querySelector(".hero")
    if (!canvas || !hero) return

    const ctx = canvas.getContext("2d")
    let ripples = []

    const blue = { r: 120, g: 160, b: 255 }

    function resize() {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
    }

    function pointOnCanvas(event) {
        const bounds = canvas.getBoundingClientRect()
        return {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
        }
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value))
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

    function mix(a, b, amount) {
        return a + (b - a) * amount
    }

    function rippleColor(ripple) {
        const heroHeight = hero.offsetHeight || canvas.height
        const start = heroHeight * 0.7
        const end = heroHeight * 1.05
        const blend = clamp((ripple.y - start) / (end - start), 0, 1)
        const rainbow = hslToRgb(ripple.hue, 85, 62)

        const r = Math.round(mix(blue.r, rainbow.r, blend))
        const g = Math.round(mix(blue.g, rainbow.g, blend))
        const b = Math.round(mix(blue.b, rainbow.b, blend))

        return `rgba(${r},${g},${b},${ripple.opacity})`
    }

    window.addEventListener("mousemove", (event) => {
        if (!canvas.width || !canvas.height) return

        const { x, y } = pointOnCanvas(event)
        ripples.push({
            x,
            y,
            radius: 0,
            opacity: 1,
            hue: (performance.now() / 12 + x * 0.35) % 360,
        })
    })

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

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

        ripples = ripples.filter((ripple) => ripple.opacity > 0)
        requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    new ResizeObserver(resize).observe(canvas)
    const site = document.querySelector("#site")
    if (site) new ResizeObserver(resize).observe(site)
    resize()
    animate()
}
