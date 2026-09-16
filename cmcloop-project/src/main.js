import "./style.css"
import { initBackground } from "./background.js"
import { initMediaDisplay, playHeroMedia } from "./mediaDisplay.js"

document.querySelector("#app").innerHTML = `
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Limelight&family=Plaster&display=swap" rel="stylesheet">
</head>
<div id="intro">

    <video
        id="intro-video"
        autoplay
        muted
        playsinline>

        <source src="/cruz_signal_noise.mp4" type="video/mp4">

    </video>

    <div class="overlay">
        <h1>LOOP</h1>
        
        <p>Click anywhere to enter</p>
    </div>
</div>

<div id="site">

    <canvas id="background"></canvas>

    <div class="site-dim"></div>

    <header class="hero">

        <div class="hero-rects" aria-hidden="true">
            <div class="hero-rect" data-media-slot>
                <video class="hero-rect-media" muted loop playsinline></video>
            </div>
            <div class="hero-rect" data-media-slot>
                <video class="hero-rect-media" muted loop playsinline></video>
            </div>
            <div class="hero-rect" data-media-slot>
                <video class="hero-rect-media" muted loop playsinline></video>
            </div>
            <div class="hero-rect" data-media-slot>
                <video class="hero-rect-media" muted loop playsinline></video>
            </div>
            <div class="hero-rect" data-media-slot>
                <video class="hero-rect-media" muted loop playsinline></video>
            </div>
        </div>

        <div class="hero-content">

            <p class="eyebrow">
                JHU Creative Media Center presents
            </p>

            <h1 id="loop-title">

                LOOP

            </h1>

            <p class="description">

                A month-long exhibition
                exploring time-based media.

            </p>

        </div>

    </header>

    <section class="about">

        <h2>

        What is LOOP?

        </h2>

        <p>

        LOOP frames and explores multimedia
        production past and present...

        </p>

    </section>

    <section id="submit">

        <h2>

        Submit Work

        </h2>

        <p>

        Student

        Faculty

        Alumni

        </p>

        <a
        class="button"

        href="https://docs.google.com/forms/d/e/1FAIpQLSfu_jv613FNZqcllwYXLcni7fPRFv6mFQRqSQZucV_j6D06Bw/viewform?usp=publish-editor">

        Open Submission Form

        </a>

    </section>
</div>
`

const intro = document.querySelector("#intro")

const site = document.querySelector("#site")

function enterSite() {
    intro.classList.add("fade")
    setTimeout(() => {
        intro.remove()
        site.style.display = "block"
        playHeroMedia()
    }, 1000)
}

// listeners for the intro page to lead into the actual site
intro.addEventListener("click", enterSite)
window.addEventListener("keydown", enterSite)

initBackground()
initMediaDisplay()

const title = document.querySelector("#loop-title");
const heroRects = document.querySelectorAll(".hero-rect");

function followPointer(element, event, amount) {
    const bounds = element.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < 300) {
        element.style.transform = `
            translate(
                ${distanceX * amount}px,
                ${distanceY * amount}px
            )
        `;
    } else {
        element.style.transform = `translate(0,0)`;
    }
}

window.addEventListener("mousemove", (e) => {
    followPointer(title, e, 0.08);
    heroRects.forEach((rect) => followPointer(rect, e, 0.03));
});
