import "./style.css"
import { initBackground } from "./background.js"
import { initMediaDisplay, playHeroMedia } from "./mediaDisplay.js"
import { initScribble } from "./scribble.js"
import cutieQuack from "./assets/cutieQuack.png"

document.querySelector("#app").innerHTML = `
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Limelight&family=M+PLUS+1p&display=swap" rel="stylesheet">
</head>

<div id="intro">

    <div id="intro-scribble"></div>

    <div class="overlay">
        <h1>LOOP</h1>
        
        <p>Click anywhere to enter</p>
    </div>

    <p class="intro-corner">Background code from Generative Gestaltung – Creative Coding im Web</p>
</div>

<div id="site">

    <div class="page-texture" aria-hidden="true"></div>

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

                ★ Open Call for Time-Based Media ★

            </p>

        </div>

        <div class="scroll-indicator" aria-label="Scroll down">
            <span class="scroll-arrow"></span>
        </div>

    </header>

    <section class="about-intro">
        <h2>
            What is LOOP?
        </h2>
        <br>
        <p>
            In celebration of Johns Hopkins University’s 150th anniversary, 
            the Creative Media Center invites the Hopkins community to submit work for LOOP,
            an exhibition of time-based media taking place November 2–20, 2026 in the Bloomberg Student Center
        </p>
        <br>
        <p>
            Supported by a Johns Hopkins University Sesquicentennial Artistic Lens Award, LOOP brings together 
            creative work from across the university as part of a yearlong celebration reflecting on Hopkins’ past, 
            present, and future.
        </p>
        <br>
        <p>
            This exhibition will be a shared space for moving-image and time-based work across disciplines. 
            Rather than a conventional screening program, the exhibition will transform the space into an 
            environment of simultaneous and recurring works, using projections, displays, and movable surfaces 
            throughout the exhibition space.
        </p>
        <br>

    </section>

    <section class="about">

        <h2>

        Who are we?

        </h2>
        <br>

        <p>

        LOOP is organized, maintained, and run by the JHU Creative Media Center (CMC).
        LOOP hopes to showcase the amazing art of our students. The CMC supports student
        innovation and creativity through our wide variety of resources and opportunities.
        </p>

        <figure class="about-image-wrap">
            <div class="about-image" role="img" aria-label="Image placeholder">
                <img src="${cutieQuack}" alt="Cutie Quack">
            </div>
            <canvas id="heart-layer"></canvas>
        </figure>

    </section>

    <section id="submit">

        <h2>

        Submit your work!

        </h2>
        <br>

        <p>
        We invite students, alumni, faculty, and staff from across Johns Hopkins to share work for LOOP.
        We welcome video, animation, experimental film, generative work, audiovisual work, documentation, 
        and other forms of screen- or projection-based media. Work may be narrative, abstract, documentary, 
        experimental, research-based, or difficult to categorize. Whether you regularly make time-based media 
        or have a project that simply feels at home in this format, we encourage you to submit. Both short- and 
        long-form works are welcome, work does not need to have been created specifically for LOOP, and multiple 
        submissions are encouraged!
      
        </p>
        <br>
        <p>
        Selected works will be presented as part of LOOP from November 2–20, 2026 in the Bloomberg Student Center.
        Submissions will be reviewed on a rolling basis through September 30, 2026 until November 20, 2026.
        </p>
        <br>
        <br>
        <a
        class="button"

        href="https://docs.google.com/forms/d/e/1FAIpQLSdkvowT3AxSk1uBgO3bRS7uv6X-C0zIlzYrnIyr20EFf7Smbg/viewform?usp=publish-editor">

        Submit your work!

        </a>

    </section>

    <footer class="site-footer">
        <p class="footer-message">
            LOOP is presented by the Johns Hopkins Creative Media Center with support from the 
            Johns Hopkins University Sesquicentennial Artistic Lens Awards.
        </p>
        <p class="footer-details">
            <a href="https://students.jhu.edu/student-life/get-involved/arts-innovation/creative-media-center/">
            Creative Media Center</a> | <a href="https://150.jhu.edu/">Johns Hopkins University Sesquicentennial</a>
        </p>
    </footer>
</div>
`

const intro = document.querySelector("#intro")

const site = document.querySelector("#site")
const scribble = initScribble(document.querySelector("#intro-scribble"))

function initSectionReveal() {
    const sections = document.querySelectorAll(".about-intro, .about, #submit")
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting)
        })
    }, {
        threshold: 0.2,
        rootMargin: "-8% 0px",
    })

    sections.forEach((section) => observer.observe(section))
}

function enterSite() {
    intro.classList.add("fade")
    scribble.remove()
    setTimeout(() => {
        intro.remove()
        site.style.display = "block"
        playHeroMedia()
        initSectionReveal()
    }, 1000)
}

// listeners for the intro page to lead into the actual site
intro.addEventListener("click", enterSite)
window.addEventListener("keydown", enterSite)

initBackground()
initMediaDisplay()

const title = document.querySelector("#loop-title");
const heroRects = document.querySelectorAll(".hero-rect");
const scrollIndicator = document.querySelector(".scroll-indicator");

function updateScrollIndicator() {
    if (!scrollIndicator) return

    if (window.scrollY > 30) {
        scrollIndicator.classList.add("is-hidden")
    } else {
        scrollIndicator.classList.remove("is-hidden")
    }
}

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

window.addEventListener("scroll", updateScrollIndicator, { passive: true });
updateScrollIndicator();
