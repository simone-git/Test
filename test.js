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
let images = [];
// ----- IMAGES ----- //


let prevTime = 0, fps = 0;
function gameLoop(timeStamp) {
    var deltaTime = timeStamp - prevTime;
    prevTime = timeStamp;

    fps = Math.round(1000 / deltaTime);
    console.log(fps + " fps");

    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);


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
    game.fillStyle = "black";
    game.fillRect(0, 0, gWIDTH, gHEIGHT);

    game.fillStyle = "white";
    game.font = "24px courier";
    game.textAlign = "start";
    game.textBaseline = "top";
    game.fillText("FPS: " + fps, 15, 10);
}