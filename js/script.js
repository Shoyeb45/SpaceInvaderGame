// Detect clicks anywhere on the parent document
document.addEventListener("click", showShips);
document.addEventListener("keydown", showShips);


function hideBackground() {
    document.querySelector(".start-msg").style.display = "none";
    document.querySelector(".game-title-container").style.display = "none";
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.65)";
    overlay.style.zIndex = "-1"; // Ensures it stays behind content
    document.body.appendChild(overlay);
}

function showShips(event) {
    hideBackground();
    document.removeEventListener("click", showShips);
    document.removeEventListener("keydown", showShips);
    const iframe = document.querySelector("iframe");
    iframe.style.display = "block";
    iframe.src = "./../start.html";
}