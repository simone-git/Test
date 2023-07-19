// ----- CANVASES ----- //
let canvas = document.getElementById("game");
let game = canvas.getContext("2d")

let frameCanvas = document.createElement("canvas");  // Can also use OffscreenCanvas
frameCanvas.setAttribute("id", "frame");
let frame = frameCanvas.getContext("2d");

let gWIDTH, gHEIGHT, fWIDTH = 32, fHEIGHT = 18, ratio = 16 / 9;

resizeGameCanvas();
window.addEventListener("resize", resizeGameCanvas, false);
// ----- CANVASES ----- //


// ----- IMAGES ----- //
let imgURLs = [
    "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3017&q=80",
    "https://as2.ftcdn.net/v2/jpg/05/25/08/09/1000_F_525080936_JEpnKXh2siYKBPpsqd98pbbcIzy4ySKz.jpg",
    "brick.png"
];
let imgAliases = [
    "img1",
    "img2",
    "brick"
];
let loadedImages = 0;
let images = [];

document.addEventListener("DOMContentLoaded", function() {
    function imgLoaded(url) {
        loadedImages++;
        console.log("fatto:", loadedImages, url);

        if(loadedImages == imgURLs.length){
            document.getElementById("loading").remove();
            document.getElementById("game").style.display = "block";
            window.requestAnimationFrame(gameLoop);
        }
    }
    
    for(let i = 0; i < imgURLs.length; i++) {
        images[imgAliases[i]] = new Image();
        images[imgAliases[i]].src = imgURLs[i];
        images[imgAliases[i]].onload = function() {
            imgLoaded(imgURLs[i]);
        }
    }
});
// ----- IMAGES ----- //


let prevTime = 0, fps = 0;
function gameLoop(timeStamp) {
    var deltaTime = timeStamp - prevTime;
    prevTime = timeStamp;

    fps = Math.round(1000 / deltaTime);

    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}


function resizeGameCanvas() {
    if(window.innerWidth / window.innerHeight >= ratio) {
        gWIDTH = Math.round(window.innerHeight * ratio);
        gHEIGHT = window.innerHeight;
        canvas.width = gWIDTH;
        canvas.height = gHEIGHT;
    } else {
        gWIDTH = window.innerWidth;
        gHEIGHT = Math.round(window.innerWidth / ratio);
        canvas.width = gWIDTH;
        canvas.height = gHEIGHT;
    }
}


function update() {

}


function draw() {
    game.fillStyle = "rgb(200, 250, 250)";
    game.fillRect(0, 0, gWIDTH, gHEIGHT);

    game.fillStyle = "black";
    game.font = "24px courier";
    game.textAlign = "start";
    game.textBaseline = "top";
    game.fillText(gWIDTH + " x " + gHEIGHT + " / FPS: " + fps, 15, 10);

    game.drawImage(images["img1"], 100, 100);
    game.drawImage(images["img2"], 250, 250);
    game.drawImage(images["brick"], 400, 400);
}