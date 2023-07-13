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
(function loadImages() {
    let img_bg = new Image(), img_bg_ok = false;  // Background
    img_bg.onload = function() {
        img_bg_ok = true;
        images["bg"] = img_bg;
    }
    img_bg.src = "./data/images/game/background.png";

    let img_brick = new Image(), img_brick_ok = false;  // Brick
    img_brick.onload = function() {
        img_brick_ok = true;
        images["brick"] = img_brick;
    }
    img_brick.src = "./data/images/game/brick.png";

    while(!img_bg_ok || !img_brick_ok) {
        console.log("waiting:", img_bg_ok, img_brick_ok);
    }
})();
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