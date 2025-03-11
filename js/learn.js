// const canvas = document.getElementById("myCanvas");
// const ctx = canvas.getContext("2d");

//         // Draw a red rectangle
//         ctx.fillStyle = "red"; 
//         ctx.fillRect(50, 50, 200, 100); // (x, y, width, height)

//         ctx.strokeStyle = "green";
//         ctx.lineWidth = 5;
//         ctx.strokeRect(50, 50, 100, 80);


//         ctx.beginPath();
//         ctx.moveTo(50, 100);
//         ctx.lineTo(300, 100);
//         ctx.strokeStyle = "black";
//         ctx.lineWidth = 3;
//         ctx.stroke();

//         ctx.beginPath();
// ctx.arc(150, 150, 50, 0, Math.PI * 2); // (x, y, radius, startAngle, endAngle)
// ctx.fillStyle = "orange";
// ctx.fill();

// ctx.font = "30px Arial";
// ctx.fillStyle = "purple";
// ctx.fillText("Hello Canvas!", 300, 50);

// ctx.strokeStyle = "black";
// ctx.lineWidth = 1;
// ctx.strokeText("Outlined Text", 100, 300);

// const img = new Image();
// img.src = "image.png"; // Replace with an actual image URL
// img.onload = function () {
//     ctx.drawImage(img, 500, 50);
// };

// let y = 0;
// let speed = 100;

// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "blue";
//     ctx.fillRect(0, y, 50, 50);

//     y += speed;

//     // Reverse direction when hitting canvas edges
//     if (y + 50 > canvas.height || y < 0) {
//         speed = -speed;
//     }

//     requestAnimationFrame(animate);
// }
// animate();