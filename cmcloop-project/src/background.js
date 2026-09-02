const canvas = document.querySelector("#background");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let ripples = [];


// create ripple when mouse moves

window.addEventListener("mousemove", (event)=>{

    ripples.push({

        x:event.clientX,
        y:event.clientY,
        radius:0,
        opacity:1

    });

});


// animation

function animate(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ripples.forEach((ripple)=>{


        ctx.beginPath();

        ctx.arc(
            ripple.x,
            ripple.y,
            ripple.radius,
            0,
            Math.PI * 2
        );


        ctx.strokeStyle =
        `rgba(120,160,255,${ripple.opacity})`;


        ctx.lineWidth = 2;

        ctx.stroke();


        ripple.radius += 3.5;

        ripple.opacity -= .01;


    });


    ripples =
    ripples.filter(
        ripple => ripple.opacity > 0
    );


    requestAnimationFrame(animate);

}


animate();


// resize handling

window.addEventListener("resize",()=>{

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

});