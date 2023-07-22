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

    // Home
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
    "data/images/levels/back-over.png",
    "data/images/levels/level.png",
    "data/images/levels/level-over.png",
    "data/images/levels/padlock.png",
    "data/images/levels/padlock-over.png"
];
let imgAliases = [
    //Common
    "common_bg",

    // Home
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
    "levels_back_over",
    "levels_level",
    "levels_level_over",
    "levels_padlock",
    "levels_padlock_over"
];
let images = [];  // Container of only images

// OPTIMIZE: Can remove overs?
let boxSpecs = [  // Syntax: boxAlias (id), imgAlias (source1), imgAlias_over (source2), specs: (CORNERS: left, top, right, bottom; CENTER: x, y, w / h); Values: [0, 1]
    // Common
    ["common_bg",               "common_bg",            "common_bg",                "CORNERS", 0, 0, 1, 1],

    // Home
    ["home_title",              "home_title",           "home_title",               "CENTER", 0.5, 0.2, "W", 0.5],
    ["home_play",               "home_play",            "home_play_over",           "CENTER", 0.5, 0.5, "W", 0.2],
    ["home_set",                "home_set",             "home_set_over",            "CENTER", 0.2, 0.8, "W", 0.2],
    ["home_inv",                "home_inv",             "home_inv_over",            "CENTER", 0.5, 0.7, "W", 0.2],

    // Levels
    ["levels_title",            "levels_title",         "levels_title",             "CENTER", 0.5, 0.15, "W", 0.4],
    ["levels_back",             "levels_back",          "levels_back_over",         "CENTER", 0.1, 0.9, "W", 0.15],
    ["levels_level_1x1",        "levels_level",         "levels_level_over",        "CENTER", 0.1, 0.9, "W", 0.15],
    ["levels_padlock_1x1",      "levels_padlock",       "levels_padlock_over",      "CENTER", 0.1, 0.9, "W", 0.15]
];
let boxes = [];  // Container of only boxes

let loadedImages = 0;
document.addEventListener("DOMContentLoaded", function() {
    for(let i = 0; i < imgPaths.length; i++) {
        images[imgAliases[i]] = new Image();
        images[imgAliases[i]].src = imgPaths[i];
        images[imgAliases[i]].onload = function() {
            loadedImages++;

            if(loadedImages == imgPaths.length) {
                boxImages();
                
                document.getElementById("loading").remove();
                document.getElementById("game").style.display = "block";
                window.requestAnimationFrame(gameLoop);
            }
        }
    }
});

function boxImages() {
    for(let i = 0; i < boxSpecs.length; i++) {
        boxes[boxSpecs[i][0]] = [];

        if(boxSpecs[i][3] == "CORNERS") {
            boxes[boxSpecs[i][0]]["left"] = gWIDTH * boxSpecs[i][4];
            boxes[boxSpecs[i][0]]["top"] = gHEIGHT * boxSpecs[i][5];
            boxes[boxSpecs[i][0]]["right"] = gWIDTH * boxSpecs[i][6];
            boxes[boxSpecs[i][0]]["bottom"] = gHEIGHT * boxSpecs[i][7];
        } else if(boxSpecs[i][3] == "CENTER") {
            let W, H;
            if(boxSpecs[i][6] == "W") {
                W = gWIDTH * boxSpecs[i][7];
                H = W * images[boxSpecs[i][1]].height / images[boxSpecs[i][1]].width;
            } else {
                H = gHEIGHT * boxSpecs[i][7];
                W = H * images[boxSpecs[i][1]].width / images[boxSpecs[i][1]].height;
            }

            boxes[boxSpecs[i][0]]["left"] = gWIDTH * boxSpecs[i][4] - 0.5 * W;
            boxes[boxSpecs[i][0]]["top"] = gHEIGHT * boxSpecs[i][5] - 0.5 * H;
            boxes[boxSpecs[i][0]]["right"] = gWIDTH * boxSpecs[i][4] + 0.5 * W;
            boxes[boxSpecs[i][0]]["bottom"] = gHEIGHT * boxSpecs[i][5] + 0.5 * H;
        }

        boxes[boxSpecs[i][0]]["width"] = boxes[boxSpecs[i][0]]["right"] - boxes[boxSpecs[i][0]]["left"];
        boxes[boxSpecs[i][0]]["height"] = boxes[boxSpecs[i][0]]["bottom"] - boxes[boxSpecs[i][0]]["top"];

        boxes[boxSpecs[i][0]]["image"] = boxSpecs[i][1];
        boxes[boxSpecs[i][0]]["image_over"] = boxSpecs[i][2];
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
            mouseInfo["x"] = Math.round(event.clientX - gameRect.left);
            mouseInfo["y"] = Math.round(event.clientY - gameRect.top);
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


function mouseTestBox(box) {
    let x = mouseInfo["x"];
    let y = mouseInfo["y"];

    return boxes[box] != undefined && x >= boxes[box].left && x <= boxes[box].right && y >= boxes[box].top && y <= boxes[box].bottom;
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


function drawBox(box) {
    game.drawImage(
        mouseTestBox(box) ? images[boxes[box].image_over] : images[boxes[box].image],
        boxes[box].left,
        boxes[box].top,
        boxes[box].width,
        boxes[box].height
    );
}

function draw() {
    game.fillStyle = "rgb(200, 250, 250)";
    game.fillRect(0, 0, gWIDTH, gHEIGHT);

    switch (scene) {
        case "home":
            drawBox("common_bg");
            drawBox("home_title");
            drawBox("home_play");
            drawBox("home_set");
            drawBox("home_inv");
            break;

        case "levels":
            drawBox("common_bg");
            drawBox("levels_title");
            drawBox("levels_back");
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