const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas size when window is resized
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/**
 * reference for bullet update interval
 */
let bulletUpdateInterval;

/**
 * reference for Collision check interval
 */
let collisionCheckInterval;

/**
 * reference for enemy movement interval
 */
let enemyMovementInterval;

// Calculate spaceship size based on canvas dimensions
const SPACESHIP_WIDTH = Math.floor(canvas.width * 0.1); // 10% of screen width
const SPACESHIP_HEIGHT = Math.floor(canvas.height * 0.15); // 15% of screen height

/**
 * Initial x-coordinate of user ship
 */
const X_COORDINATE_USER_SHIP = canvas.width / 2 - SPACESHIP_WIDTH / 2;

/**
 * Initial y-coordinate of user ship
 */
const Y_COORDINATE_USER_SHIP = canvas.height - SPACESHIP_HEIGHT - 20;

/**
 * speed of user ship to go left and right
 */
const speed = 10; // Scale speed to screen width

/**
 * moving speed of enemy
 */
const enemySpeed = 3; // Scale enemy speed                           

/**
 * User choice to play the game by which space ship
 */
let choice = new URLSearchParams(window.location.search).get("choice") | 0;

/**
 * Initial direction of enemy spaceship 
 */
let enemyDirection = 1;

/**
 * Flag for game over or not
 */
let gameOver = false;

// Audio assets

/**
 * Explosion sound
 */
const explosionSound = new Audio("./assets/audio/explosion.mp3");

/**
 * Bullet firing sound
 */
const bulletFireSound = new Audio("./assets/audio/bulletfire.mp3");

/**
 * Explosion gif
 */
const explosionImg = new Image();
explosionImg.src = "./assets/images/explosionGif2.gif";

/**
 * Explosions array to track all explosions
 */
let explosions = [];

/**
 * Calculate enemy dimensions based on canvas size
 */
const ENEMY_WIDTH = Math.floor(canvas.width * 0.05); // 3% of screen width
const ENEMY_HEIGHT = Math.floor(canvas.height * 0.05); // 3% of screen height
const rowSpace = Math.floor(canvas.height * 0.1); // 5% of screen height
const enemySpacing = Math.floor(canvas.width * 0.02); // 1% of screen width

/**
 * List of all user spaceship
 */
let spaceships = [
    { x: X_COORDINATE_USER_SHIP, y: Y_COORDINATE_USER_SHIP, width: SPACESHIP_WIDTH, height: SPACESHIP_HEIGHT, img: new Image(), path: "./assets/images/spaceship1.png" },  // spaceship-1
    { x: X_COORDINATE_USER_SHIP, y: Y_COORDINATE_USER_SHIP, width: SPACESHIP_WIDTH, height: SPACESHIP_HEIGHT, img: new Image(), path: "./assets/images/spaceship2.png" },  // spaceship-2
    { x: X_COORDINATE_USER_SHIP, y: Y_COORDINATE_USER_SHIP, width: SPACESHIP_WIDTH, height: SPACESHIP_HEIGHT, img: new Image(), path: "./assets/images/spaceship3.png" }   // spaceship-3
];

/**
 * User chosen spaceship
 */
let spaceship = spaceships[choice];
spaceship.img.src = spaceship.path;   // Load the spaceship

// Enemy ships

/**
 * Number of rows of enemy spaceship
 */
const enemyRows = 3;

/**
 * Number of columns of enemy spaceship - adjust based on screen width
 */
const enemyCols = Math.floor(canvas.width / (ENEMY_WIDTH + enemySpacing) * 0.9);

/**
 * List of all enemy space ships
 */
let enemyShips = [];

/**
 * Player score, increment by 10 if the user will hit any enemy ship
 */

let score = 0;
// Populate enemy ships
for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
        let enemy = {
            x: col * (ENEMY_WIDTH + enemySpacing) + canvas.width * 0.1, // Start 10% from left edge
            y: row * rowSpace + canvas.height * 0.05, // Start 5% from top
            width: ENEMY_WIDTH,
            height: ENEMY_HEIGHT,
            img: new Image(),
            path: "./assets/images/enemySS.png"
        };
        enemy.img.src = enemy.path;
        enemyShips.push(enemy);
    }
}

// Bullets

/**
 * Calculate bullet dimensions based on canvas size
 */
const BULLET_WIDTH = Math.floor(canvas.width * 0.03); // 1% of screen width
const BULLET_HEIGHT = Math.floor(canvas.height * 0.05); // 3% of screen height

/**
 * user fired bullet array to keep track
 */
let bullets = [];

/**
 * enemy fired bullet array to keep track
 */
let enemyBullets = [];

/**
 * user fired bullet speed
 */
const bulletSpeed = Math.floor(canvas.height * 0.01) + 3; // Scale bullet speed to screen height                                   

/**
 * Enemy fired bullet speed
 */
const enemyBulletSpeed = Math.floor(canvas.height * 0.002) + 2; // Scale enemy bullet speed               

/**
 * User fired bullet image loaded
 */
const bulletImg = new Image();
bulletImg.src = "./assets/images/userBullet.png";

/**
 * Enemy fired bullet image loaded
 */
const enemyBulletImg = new Image();
enemyBulletImg.src = "./assets/images/enemyBullet.png";

/**
 * Function to create explsion when bullet will hit space ship
 * @param {*} x     : x-coordinate of explosion
 * @param {*} y     : y-coordinate of explosion
 * @param {*} width : width of explosion
 * @param {*} height: height of explosion
 */
function createExplosion(x, y, width, height) {
    // Play explosion sound
    explosionSound.currentTime = 0.4;
    explosionSound.play();

    // Create explosion object
    let explosion = {
        x: x,
        y: y,
        width: width,
        height: height,
        img: explosionImg,
        duration: 300, // Duration in milliseconds
        startTime: Date.now()
    };

    explosions.push(explosion);  // Push in explosion array
}

/**
 * Fire user bullet, when user will press space button
 */
function fire() {
    // Play bullet fire sound
    bulletFireSound.currentTime = 0.08;
    bulletFireSound.play();

    let bullet = {
        x: spaceship.x + spaceship.width / 2 - BULLET_WIDTH / 2,
        y: spaceship.y - BULLET_HEIGHT,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        img: bulletImg
    };
    bullets.push(bullet);
}


/**
 * Randomy firing of eney bullet. 
 * @returns void
 */
function enemyFire() {
    // Don't fire if the game is over
    if (gameOver) {
        return;
    }

    // Check if there is any enemy ships
    if (enemyShips.length > 0) {
        let shooter = enemyShips[Math.floor(Math.random() * enemyShips.length)];    // select random bullet

        // create bullet object with all information 
        let bullet = {
            x: shooter.x + shooter.width / 2 - BULLET_WIDTH / 2,
            y: shooter.y + shooter.height,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT,
            img: enemyBulletImg
        };


        enemyBullets.push(bullet);          // push bullet in enemy bullets list
    }
    setTimeout(enemyFire, 1200);            // Enemy fires every second
}

/**
 * Update bullets and explosions    
 */
function updateBullets() {

    // Perform operation on fired bullet
    bullets.forEach((bullet, i) => {
        bullet.y -= bulletSpeed;                // decrease y-coordinate to show that bullet is advancing towards enemy spacheships
        if (bullet.y < 0) {
            bullets.splice(i, 1);               // If it crosses upper edge of canvas then remove that bullet
        }
    });

    // Perform operation on enemy fired bullet
    enemyBullets.forEach((bullet, i) => {
        bullet.y += enemyBulletSpeed;           // Increase y-coordinate to show that bullet is advancing towards user spaceship
        if (bullet.y > canvas.height) {
            enemyBullets.splice(i, 1);          // If it crosses lower edge of canvas then remove that bullet
        }
    });

    // Update explosions - remove expired ones
    for (let i = explosions.length - 1; i >= 0; i--) {
        // If the explosion time exceeds 300 ms. As we have added start time of explosion so we can calculate real duration, and we can remove outdated explosions
        if (Date.now() - explosions[i].startTime > explosions[i].duration) {
            explosions.splice(i, 1);
        }
    }
}


/**
 * Check collisions 
 * @returns void
 */
function checkCollisions() {

    // Check player bullets hitting enemy ships
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];

        for (let j = enemyShips.length - 1; j >= 0; j--) {
            let enemy = enemyShips[j];

            // Collision condition
            if (
                bullet.x < enemy.x + enemy.width &&   // left side of the bullet is before the right side of the enemy
                bullet.x + bullet.width > enemy.x &&  // right side of the bullet is after the left side of the enemy
                bullet.y < enemy.y + enemy.height &&  // top of the bullet is before the bottom of the enemy
                bullet.y + bullet.height > enemy.y    // bottom of the bullet is after the top of the enemy
            ) {
                score += 10;
                // Create explosion at enemy position
                createExplosion(enemy.x - 10, enemy.y - 10, enemy.width + 20, enemy.height + 20);

                // Remove bullet and enemy
                bullets.splice(i, 1);
                enemyShips.splice(j, 1);

                // Check if all enemies are defeated
                if (enemyShips.length === 0) {
                    setTimeout(() => {
                        endGame("You won! All Enemies defeated");
                    }, 500);
                }

                // Exit inner loop since bullet is gone
                break;
            }
        }
    }

    // Check enemy bullets hitting player
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let bullet = enemyBullets[i];

        // Create a smaller hitbox for the player's ship - a rectangular box around ship for better accuracy of collision
        const hitboxPadding = Math.floor(SPACESHIP_WIDTH * 0.15);
        const playerHitbox = {
            x: spaceship.x + hitboxPadding,
            y: spaceship.y + hitboxPadding,
            width: spaceship.width - (hitboxPadding * 2),
            height: spaceship.height - (hitboxPadding * 2)
        };

        // Create a smaller hitbox for the bullet - a rectangular box around bullet for better accuracy of collsion
        const bulletHitboxPadding = Math.floor(BULLET_WIDTH * 0.2);
        const bulletHitbox = {
            x: bullet.x + bulletHitboxPadding,
            y: bullet.y + bulletHitboxPadding,
            width: bullet.width - (bulletHitboxPadding * 2),
            height: bullet.height - (bulletHitboxPadding * 2)
        };

        // Same conditions for this collision also, we just added rectangle around both the objects for better accuracy
        if (
            bulletHitbox.x < playerHitbox.x + playerHitbox.width &&
            bulletHitbox.x + bulletHitbox.width > playerHitbox.x &&
            bulletHitbox.y < playerHitbox.y + playerHitbox.height &&
            bulletHitbox.y + bulletHitbox.height > playerHitbox.y
        ) {
            // Create explosion at player position
            createExplosion(spaceship.x - 10, spaceship.y - 10, spaceship.width + 20, spaceship.height + 20);

            // Remove the bullet that hit the player
            enemyBullets.splice(i, 1);

            // Wait a short time to show explosion before ending game
            setTimeout(() => {
                clearInterval(enemyMovementInterval);
                clearInterval(bulletUpdateInterval);
                endGame("Game Over");
            }, 500);

            return; // Exit the function to prevent multiple triggers
        }
    }
}

// Create video element dynamically
const video = document.createElement("video");
video.src = "./assets/video/universeBG.mp4";
video.loop = true;
video.muted = true;  // Ensure autoplay works in all browsers
video.autoplay = true;

/**
 * This function is doing main thing, i.e., to draw everything on canvas 
 */
function draw() {
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background video
    if (video.readyState >= 2) { // Ensure video is loaded before drawing
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // ctx.drawImage(video, 0, 0);
    }

    // Draw player ship if game is not over
    if (!gameOver) {
        ctx.drawImage(spaceship.img, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    }
    // Draw enemies
    enemyShips.forEach(enemy => ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height));

    // Draw bullets
    bullets.forEach(bullet => ctx.drawImage(bullet.img, bullet.x, bullet.y, bullet.width, bullet.height));
    enemyBullets.forEach(bullet => ctx.drawImage(bullet.img, bullet.x, bullet.y, bullet.width, bullet.height));

    // Draw explosions
    explosions.forEach(explosion => {
        ctx.drawImage(explosion.img, explosion.x, explosion.y, explosion.width, explosion.height);
    });


    // Pass it in game loop, here we are passing this function in function to repeat it's frame
    requestAnimationFrame(draw);
}


/**
 * Function to move enemies : from left to right and top to bottom as it will touch edge
 */
function moveEnemies() {
    let edgeReached = false;

    // incrementing the x-coordinate according to enemy direction
    enemyShips.forEach(enemy => {
        enemy.x += enemySpeed * enemyDirection;
        // if enemy ships are touching either of the edges of canvas, then mark as reversed 
        if (enemy.x + enemy.width >= canvas.width || enemy.x <= 0) {
            edgeReached = true;
        }

        // Check if enemies reached the player's level
        if (enemy.y + enemy.height >= spaceship.y) {
            setTimeout(() => {
                endGame("Game Over!! Enemy reached your base");
            }, 500);
        }
    });

    // Reverse the direction and move all enemy ships to one step closer to user
    if (edgeReached) {
        enemyDirection *= -1;
        enemyShips.forEach(enemy => enemy.y += Math.floor(canvas.height * 0.01) + 10); // Scale the descent
    }

    enemyMovementInterval = setTimeout(moveEnemies, 70);
}


/**
 * function which will provide main controller to the user.
 * "LeftArrow" (<-) or "a" or "A" : user control to move spaceship left side
 * "RightArrow" (->) or "d" or "D" : user control to move spaceship right side
 * space bar : fire bullet
 * @param {*} event : default event object while adding event
 * @returns 
 */
function handleKeyDown(event) {
    // If game is over, then don't provide the control
    if (gameOver) {
        return;
    }

    // Provide functinality for right movement
    if ((event.key === "ArrowRight" || event.key.toLowerCase() === "d") && spaceship.x + spaceship.width < canvas.width) {
        spaceship.x += speed;
    }
    // Provide functionality for left movement
    else if ((event.key === "ArrowLeft" || event.key.toLowerCase() === "a") && spaceship.x > 0) {
        spaceship.x -= speed;
    }
    // Provide functionality for space bar 
    else if (event.key === " ") {
        fire();  // Invoke fire function
    }
}

// add event listener if any key is pressed 
document.addEventListener("keydown", handleKeyDown);


// Draw background video
video.play();
// Initial frame
requestAnimationFrame(draw);

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('instructionsModal');
    const closeBtn = document.getElementById('closeModal');
    const startBtn = document.getElementById('startGame');

    // Close modal when clicking the close button
    closeBtn.addEventListener('click', function () {
        closeModal();
    });

    // Close modal when clicking the start button
    startBtn.addEventListener('click', function () {
        closeModal();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        startGame();
    }

    // Add transition for smooth fade out
    modal.style.transition = 'opacity 0.3s ease';
});



/**
 * Start the game : pass the draw function to draw all the images
 */
function startGame() {
    // video.play();
    requestAnimationFrame(draw);
    // At constant interval update bullets and check for collision
    bulletUpdateInterval = setInterval(updateBullets, 30);
    collisionCheckInterval = setInterval(checkCollisions, 30);

    // Invoke move enemies and fire enemy function
    moveEnemies();
    enemyFire();
}



/**
 * Function to handle game over
 */
function endGame(msg) {
    // Change gameover flag
    gameOver = true;

    // Stop enemy and bullet updates
    clearInterval(enemyMovementInterval);
    clearInterval(bulletUpdateInterval);
    clearInterval(collisionCheckInterval);

    // Show game over message after a short delay to see final explosion
    setTimeout(() => {
        document.querySelector("#score").innerHTML = `Score: ${score}`;
        const modal = document.getElementById("game-over-modal");
        modal.style.display = "flex";

        const yesBtn = document.querySelector("#yes-btn");
        const noBtn = document.querySelector("#no-btn");
        yesBtn.setAttribute("href", `./game.html?choice=${choice}`)

        document.querySelector("#game-over-modal h1").innerHTML = msg;

        noBtn.addEventListener("mouseover", (event) => {
            document.querySelector("#yes-btn i").style.visibility = "hidden";
            document.querySelector("#no-btn i").style.visibility = "visible";
        });

        yesBtn.addEventListener("mouseover", (event) => {
            document.querySelector("#no-btn i").style.visibility = "hidden";
            document.querySelector("#yes-btn i").style.visibility = "visible";
        });
        // Optionally, disable user controls
        document.removeEventListener("keydown", handleKeyDown);
    }, 1000);
}

