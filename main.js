// ----- CANVAS ----- //
let canvas = document.getElementById("game");
let game = canvas.getContext("2d")

let sceneInfo = [];
sceneInfo["scene"] = "home";

let prevTime = 0, fps = 0;

// let frameCanvas = document.createElement("canvas");  // Can also use OffscreenCanvas
// frameCanvas.setAttribute("id", "frame");
// let frame = frameCanvas.getContext("2d");

let gWIDTH, gHEIGHT, ratio = 16 / 9;

resizeCanvas(false);
window.addEventListener("resize", resizeCanvas, false);


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
// ----- CANVAS ----- //


// ----- LEVELS ----- //
let levels = [];
levels[0] = { "": [] };
// ----- LEVELS ----- //


// ----- IMAGES AND BOXES ----- //
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
            boxes[boxSpecs[i][0]]["left"] = gWIDTH * boxSpecs[i][4] / 160;
            boxes[boxSpecs[i][0]]["top"] = gHEIGHT * boxSpecs[i][5] / 90;
            boxes[boxSpecs[i][0]]["right"] = gWIDTH * boxSpecs[i][6] / 160;
            boxes[boxSpecs[i][0]]["bottom"] = gHEIGHT * boxSpecs[i][7] / 90;
            
            boxes[boxSpecs[i][0]]["center_x"] = (boxes[boxSpecs[i][0]]["left"] + boxes[boxSpecs[i][0]]["right"]) / 2;
            boxes[boxSpecs[i][0]]["center_y"] = (boxes[boxSpecs[i][0]]["top"] + boxes[boxSpecs[i][0]]["bottom"]) / 2;
        } else if(boxSpecs[i][3] == "CENTER") {
            let W, H;
            if(boxSpecs[i][6] == "W") {
                W = gWIDTH * boxSpecs[i][7] / 160;
                H = W * images[boxSpecs[i][1]].height / images[boxSpecs[i][1]].width;
            } else {
                H = gHEIGHT * boxSpecs[i][7] / 90;
                W = H * images[boxSpecs[i][1]].width / images[boxSpecs[i][1]].height;
            }

            boxes[boxSpecs[i][0]]["left"] = gWIDTH * boxSpecs[i][4] / 160 - 0.5 * W;
            boxes[boxSpecs[i][0]]["top"] = gHEIGHT * boxSpecs[i][5] / 90 - 0.5 * H;
            boxes[boxSpecs[i][0]]["right"] = gWIDTH * boxSpecs[i][4] / 160 + 0.5 * W;
            boxes[boxSpecs[i][0]]["bottom"] = gHEIGHT * boxSpecs[i][5] / 90 + 0.5 * H;

            boxes[boxSpecs[i][0]]["center_x"] = gWIDTH * boxSpecs[i][4] / 160;
            boxes[boxSpecs[i][0]]["center_y"] = gHEIGHT * boxSpecs[i][5] / 90;
        }

        boxes[boxSpecs[i][0]]["width"] = boxes[boxSpecs[i][0]]["right"] - boxes[boxSpecs[i][0]]["left"];
        boxes[boxSpecs[i][0]]["height"] = boxes[boxSpecs[i][0]]["bottom"] - boxes[boxSpecs[i][0]]["top"];

        boxes[boxSpecs[i][0]]["image"] = boxSpecs[i][1];
        boxes[boxSpecs[i][0]]["image_over"] = boxSpecs[i][2];
    }
}
// ----- IMAGES AND BOXES ----- //


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


function mouseTestBox(box) {
    let x = mouseInfo["x"];
    let y = mouseInfo["y"];

    return boxes[box] != undefined && x >= boxes[box].left && x <= boxes[box].right && y >= boxes[box].top && y <= boxes[box].bottom;
}
// ----- MOUSE ----- //


// ----- KEYBOARD ----- //
let keyboardInfo = [];

function keyboardEvent(event) {
    keyboardInfo[event.key.toUpperCase()] = (event.type == "keydown");
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

// TODO: Fully manage keyboard inputs and add keyboard menu navigation
function update() {
    switch (sceneInfo["scene"]) {
        case "home":
            if(mouseInfo["clicked"] == true) {
                if(mouseTestBox("home_play")) {
                    sceneInfo = [];
                    sceneInfo["scene"] = "levels";
                }

                // if(mouseTestBox("home_set")) scene = "settings";
                // if(mouseTestBox("home_inv")) scene = "inventory";
            }
            break;
    
        case "levels":
            if(mouseInfo["clicked"] == true) {
                if(mouseTestBox("levels_back")) {
                    sceneInfo = [];
                    sceneInfo["scene"] = "home";
                }

                for(let i = 1; i <= 16; i++) {
                    if(mouseTestBox("levels_level_" + i)) {
                        sceneInfo = [];
                        sceneInfo["scene"] = "play";
                        sceneInfo["level"] = i;
                    }
                }
            }
            break;
        
        case "play":
            if(keyboardInfo["A"] == true) {
                sceneInfo = [];
                sceneInfo["scene"] = "levels";
            }
            break;
    }

    mouseInfo["clicked"] = false;
    keyboardInfo = [];  // TODO: look before update() and reset after each scene change
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

    switch (sceneInfo["scene"]) {
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

            game.fillStyle = "white";
            game.font = "" + Math.round(gWIDTH * 13 / 160 * 0.6) + "px Library";
            game.textAlign = "center";
            game.textBaseline = "middle";
            for(let i = 1; i <= 16; i++) {
                drawBox("levels_level_" + i);
                game.fillText(i, boxes["levels_level_" + i].center_x, boxes["levels_level_" + i].center_y);
                game.globalAlpha = 0.85;
                drawBox("levels_padlock_" + i);
                game.globalAlpha = 1;
            }
            break;

        case "play":
            drawBox("common_bg");
    }

    game.fillStyle = "black";
    game.font = "20px courier";
    game.textAlign = "start";
    game.textBaseline = "top";
    let text = "FPS: " + fps + " / " +
        gWIDTH + " x " + gHEIGHT + " / " + 
        "MOUSE: (" + (mouseInfo["x"] / gWIDTH * 160) + ", " + (mouseInfo["y"] / gHEIGHT * 90) + ")";
    game.fillText(text, 8, 4);
}