import "./style.css"
import "./background.js"

document.querySelector("#app").innerHTML = `

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

    <header class="hero">

        <div class="hero-content">

            <p class="eyebrow">
                Johns Hopkins University
            </p>

            <h1 id="loop-title">

                LOOP

            </h1>

            <p class="description">

                A month-long exhibition
                exploring time-based media.

            </p>

            <a
                href="#submit"
                class="button">

                Submit Work

            </a>

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

    <section
    id="submit">

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

intro.addEventListener("click", () => {

    intro.classList.add("fade")

    setTimeout(() => {

        intro.remove()

        site.style.display = "block"

    },1000)

})

function enterSite() {
    intro.classList.add("fade")
    setTimeout(() => {
        intro.remove()
        site.style.display = "block"
    }, 1000)
}

intro.addEventListener("click", enterSite)
window.addEventListener("keydown", enterSite)

const title = document.querySelector("#loop-title");


window.addEventListener("mousemove", (e)=>{

    const rect = title.getBoundingClientRect();


    const titleX = rect.left + rect.width / 2;
    const titleY = rect.top + rect.height / 2;


    const distanceX = e.clientX - titleX;
    const distanceY = e.clientY - titleY;


    const distance = Math.sqrt(
        distanceX ** 2 + distanceY ** 2
    );


    if(distance < 300){

        title.style.transform = `
            translate(
                ${distanceX * 0.08}px,
                ${distanceY * 0.08}px
            )
        `;

    } else {

        title.style.transform = `
            translate(0,0)
        `;

    }

});
