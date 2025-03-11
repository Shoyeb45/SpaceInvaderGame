const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const X_COORDINATE_USER_SHIP = canvas.width / 2 - 10;
const y_COORDINATE_USER_SHIP = canvas.height - 30;
const speed = 5; // Movement speed
let choice = 1;
// Spaceships array (you can add more ships here)
let spaceships = [
    { x: X_COORDINATE_USER_SHIP, y: y_COORDINATE_USER_SHIP, width: 30, height: 30, img: new Image(), path: "./../assets/images/spaceship1.png" },
    { x: X_COORDINATE_USER_SHIP, y: y_COORDINATE_USER_SHIP + 3, width: 20, height: 20, img: new Image(), path: "./../assets/images/spaceship2.png" },
    { x: X_COORDINATE_USER_SHIP, y: y_COORDINATE_USER_SHIP + 3, width: 20, height: 20, img: new Image(), path: "./../assets/images/spaceship3.png" }
];

let spaceship = spaceships[choice];

// Load image
spaceship.img.src = spaceship.path;

// Draw all spaceships
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clears previous frame

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    requestAnimationFrame(draw); // Keeps updating the canvas
}

// Listen for keyboard events
document.addEventListener("keydown", (event) => {
    console.log(event.key);
    
    if ((event.key === "ArrowRight" || event.key === "d" || event.key === "D") && spaceship.x + spaceship.width < canvas.width) {
        spaceship.x += speed;
    } else if ((event.key === "ArrowLeft" || event.key === "a" || event.key === "A") && spaceship.x > 0) {
        spaceship.x -= speed
    }
    else if (event.key === " ") {
            
    }
});



// Start animation loop
requestAnimationFrame(draw);
