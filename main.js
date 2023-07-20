class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}


class Box {
    constructor() {

    }
}


class Button {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}
let b = new Button(1, 2, 3, 4);


// ----- CANVAS ----- //
let canvas = document.getElementById("game");
let game = canvas.getContext("2d")
let scene = "home";
let prevTime = 0, fps = 0;

/*let frameCanvas = document.createElement("canvas");  // Can also use OffscreenCanvas
frameCanvas.setAttribute("id", "frame");
let frame = frameCanvas.getContext("2d");*/

let gWIDTH, gHEIGHT, fWIDTH = 32, fHEIGHT = 18, ratio = 16 / 9;

resizeCanvas(false);
window.addEventListener("resize", resizeCanvas, false);
// ----- CANVAS ----- //


// ----- IMAGES ----- //
let imgPaths = [
    // Common
    "data/images/common/background.png",

    // Play
    "data/images/home/title.png",
    "data/images/home/play.png",
    "data/images/home/play-over.png",
    "data/images/home/settings.png",
    "data/images/home/settings-over.png",
    "data/images/home/inventory.png",
    "data/images/home/inventory-over.png",

    // Levels
    "data/images/levels/title.png",
    "data/images/levels/back.png",
    "data/images/levels/back-over.png"
];
let imgAliases = [
    //Common
    "common_bg",

    // Play
    "home_title",
    "home_play",
    "home_play_over",
    "home_set",
    "home_set_over",
    "home_inv",
    "home_inv_over",

    // Levels
    "levels_title",
    "levels_back",
    "levels_back_over"
];
let imgBoxSpecs = [  // Values: [0, 1]; CORNERS: left, top, right, bottom; CENTER: x, y, w / h
    // Common
    ["CORNERS", 0, 0, 1, 1],

    // Play
    ["CENTER", 0.5, 0.2, "W", 0.5],
    ["CENTER", 0.5, 0.5, "W", 0.2],
    ["CENTER", 0.5, 0.5, "W", 0.2],
    ["CENTER", 0.3, 0.7, "W", 0.2],
    ["CENTER", 0.3, 0.7, "W", 0.2],
    ["CENTER", 0.5, 0.7, "W", 0.2],
    ["CENTER", 0.5, 0.7, "W", 0.2],

    // Levels
    ["CENTER", 0.5, 0.2, "W", 0.5],
    ["CENTER", 0.3, 0.8, "W", 0.2],
    ["CENTER", 0.3, 0.8, "W", 0.2]
];
let imgBoxes = [];
let images = [];
let loadedImages = 0;

document.addEventListener("DOMContentLoaded", function() {
    function imageLoaded() {
        loadedImages++;

        if(loadedImages == imgPaths.length) {
            boxImages();
            
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

function boxImages() {
    for(let i = 0; i < imgAliases.length; i++) {
        imgBoxes[imgAliases[i]] = [];

        if(imgBoxSpecs[i][0] == "CORNERS") {
            imgBoxes[imgAliases[i]]["left"] = gWIDTH * imgBoxSpecs[i][1];
            imgBoxes[imgAliases[i]]["top"] = gHEIGHT * imgBoxSpecs[i][2];
            imgBoxes[imgAliases[i]]["right"] = gWIDTH * imgBoxSpecs[i][3];
            imgBoxes[imgAliases[i]]["bottom"] = gHEIGHT * imgBoxSpecs[i][4];
        } else if(imgBoxSpecs[i][0] == "CENTER") {
            let W, H;
            if(imgBoxSpecs[i][3] == "W") {
                W = gWIDTH * imgBoxSpecs[i][4];
                H = W * images[imgAliases[i]].height / images[imgAliases[i]].width;
            } else {
                H = gHEIGHT * imgBoxSpecs[i][4];
                W = H * images[imgAliases[i]].width / images[imgAliases[i]].height;
            }

            imgBoxes[imgAliases[i]]["left"] = gWIDTH * imgBoxSpecs[i][1] - 0.5 * W;
            imgBoxes[imgAliases[i]]["top"] = gHEIGHT * imgBoxSpecs[i][2] - 0.5 * H;
            imgBoxes[imgAliases[i]]["right"] = gWIDTH * imgBoxSpecs[i][1] + 0.5 * W;
            imgBoxes[imgAliases[i]]["bottom"] = gHEIGHT * imgBoxSpecs[i][2] + 0.5 * H;
        }
        imgBoxes[imgAliases[i]]["width"] = imgBoxes[imgAliases[i]]["right"] - imgBoxes[imgAliases[i]]["left"];
        imgBoxes[imgAliases[i]]["height"] = imgBoxes[imgAliases[i]]["bottom"] - imgBoxes[imgAliases[i]]["top"];
    }
}
// ----- IMAGES ----- //


// ----- MOUSE ----- //
let mouseInfo = [];
mouseInfo["x"] = 0;
mouseInfo["y"] = 0;

function mouseEvent(event) {
    switch (event.type) {
        case "mousemove":
            // mouseInfo["moving"] = true;

            let gameRect = document.getElementById("game").getBoundingClientRect();
            mouseInfo["x"] = event.clientX - gameRect.left;
            mouseInfo["y"] = event.clientY - gameRect.top;
            break;
        
            case "mousedown":
                mouseInfo["clicked"] = true;
                break;
    
            case "mouseup":
                mouseInfo["up"] = true;
                mouseInfo["down"] = false;
                break;
    
        default:
            break;
    }
}

document.addEventListener("mousemove", mouseEvent);
document.addEventListener("mousedown", mouseEvent);
// document.addEventListener("mouseup", mouseEvent);
// ----- MOUSE ----- //


// ----- KEYBOARD ----- //
let keyboardInfo = [];

function keyboardEvent(event) {
    keyboardInfo[event.key] = (event.type == "keydown");
}

document.addEventListener("keydown", keyboardEvent);
document.addEventListener("keyup", keyboardEvent);
// ----- KEYBOARD ----- //


function gameLoop(timeStamp) {
    var deltaTime = timeStamp - prevTime;
    prevTime = timeStamp;

    fps = Math.round(1000 / deltaTime);

    update();
    draw();

    window.requestAnimationFrame(gameLoop);
}


function resizeCanvas(boxImgs = true) {
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

    if(boxImgs) {
        boxImages();
    }
}


function mouseTestBox(alias) {
    let x = mouseInfo["x"];
    let y = mouseInfo["y"];

    if(imgAliases.includes(alias)) {
        return x >= imgBoxes[alias].left && x <= imgBoxes[alias].right && y >= imgBoxes[alias].top && y <= imgBoxes[alias].bottom;
    }
    return false;
}


function update() {
    if(mouseInfo["clicked"] == true) {
        switch (scene) {
            case "home":
                if(mouseTestBox("home_play")) scene = "levels";
                // if(mouseTestBox("home_set")) scene = "settings";
                // if(mouseTestBox("home_inv")) scene = "inventory";
                break;
        
            case "levels":
                if(mouseTestBox("levels_back")) scene = "home";
                break;
        }
    }

    mouseInfo["clicked"] = false;
}


function drawImage(alias, alias_over = alias) {
    let img;
    if(alias_over == alias) {
        img = images[alias];
    } else {
        img = mouseTestBox(alias) ? images[alias_over] : images[alias];
    }

    game.drawImage(img, imgBoxes[alias].left, imgBoxes[alias].top, imgBoxes[alias].width, imgBoxes[alias].height);
}

function draw() {
    game.fillStyle = "rgb(200, 250, 250)";
    game.fillRect(0, 0, gWIDTH, gHEIGHT);

    switch (scene) {
        case "home":
            drawImage("common_bg");
            drawImage("home_title");
            drawImage("home_play", "home_play_over");
            drawImage("home_set", "home_set_over");
            drawImage("home_inv", "home_inv_over");
            break;

        case "levels":
            drawImage("common_bg");
            drawImage("levels_title");
            drawImage("levels_back", "levels_back_over");
            break;
    }

    game.fillStyle = "black";
    game.font = "20px courier";
    game.textAlign = "start";
    game.textBaseline = "top";
    let text = "FPS: " + fps + " / " +
        gWIDTH + " x " + gHEIGHT + " / " + 
        "MOUSE: (" + mouseInfo["x"] + ", " + mouseInfo["y"] + ")";
    game.fillText(text, 8, 4);
}