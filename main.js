// ----- CANVAS ----- //
let canvas = document.getElementById("game");
let game = canvas.getContext("2d")

/*let frameCanvas = document.createElement("canvas");  // Can also use OffscreenCanvas
frameCanvas.setAttribute("id", "frame");
let frame = frameCanvas.getContext("2d");*/

let gWIDTH, gHEIGHT, fWIDTH = 32, fHEIGHT = 18, ratio = 16 / 9;

resizeCanvas();
window.addEventListener("resize", resizeCanvas, false);
// ----- CANVAS ----- //


// ----- IMAGES ----- //
let imgPaths = [
    "data/images/home/background.png",
    "data/images/home/title.png",
    "data/images/home/play.png",
    "data/images/home/settings.png",
    "data/images/home/inventory.png"
];
let imgAliases = [
    "home_bg",
    "home_title",
    "home_play",
    "home_set",
    "home_inv"
];
let loadedImages = 0;
let images = [];

document.addEventListener("DOMContentLoaded", function() {
    function imageLoaded() {
        loadedImages++;

        if(loadedImages == imgPaths.length){
            document.getElementById("loading").remove();
            document.getElementById("game").style.display = "block";
            window.requestAnimationFrame(gameLoop);
        }
    }
    
    for(let i = 0; i < imgPaths.length; i++) {
        images[imgAliases[i]] = new Image();
        images[imgAliases[i]].src = imgPaths[i];
        images[imgAliases[i]].onload = function() {
            imageLoaded();
        }
    }
});
// ----- IMAGES ----- //


// ----- MOUSE ----- //
let mouseInfo = [];
mouseInfo["mouse-x"] = 0;
mouseInfo["mouse-y"] = 0;

function mouseEvent(event) {
    switch (event.type) {
        case "mousemove":
            mouseInfo["mousemove"] = true;

            let gameRect = document.getElementById("game").getBoundingClientRect();
            mouseInfo["mouse-x"] = event.clientX - gameRect.left;
            mouseInfo["mouse-y"] = event.clientY - gameRect.top;
            break;
        
            case "mousedown":
                mouseInfo["mousedown"] = true;
                mouseInfo["mouseup"] = false;
                break;
    
            case "mouseup":
                mouseInfo["mouseup"] = true;
                mouseInfo["mousedown"] = false;
                break;
    
        default:
            break;
    }
}

document.addEventListener("mousemove", mouseEvent);
document.addEventListener("mousedown", mouseEvent);
document.addEventListener("mouseup", mouseEvent);
// ----- MOUSE ----- //


// ----- KEYBOARD ----- //
let keyboardInfo = [];

function keyboardEvent(event) {
    keyboardInfo[event.key] = (event.type == "keydown");
}

document.addEventListener("keydown", keyboardEvent);
document.addEventListener("keyup", keyboardEvent);
// ----- KEYBOARD ----- //


let prevTime = 0, fps = 0;
function gameLoop(timeStamp) {
    var deltaTime = timeStamp - prevTime;
    prevTime = timeStamp;

    fps = Math.round(1000 / deltaTime);

    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}


function resizeCanvas() {
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

    game.drawImage(images["home_bg"], 0, 0, gWIDTH, gHEIGHT);

    game.fillStyle = "black";
    game.font = "24px courier";
    game.textAlign = "start";
    game.textBaseline = "top";
    let text = "FPS: " + fps + " / " +
        gWIDTH + " x " + gHEIGHT + " / " + 
        "MOUSE: (" + mouseInfo["mouse-x"] + ", " + mouseInfo["mouse-y"] + ")";
    game.fillText(text, 15, 10);
}