// ----- CANVAS ----- //
// #region Canvas
let canvas = document.getElementById("game");
let game = canvas.getContext("2d");

//let dd = new Drawer();

let sceneInfo = [];
sceneInfo["scene"] = "home";

let prevTime = 0, fps = 0;

let pxWidth, pxHeight, ratio = 16 / 9;

resizeCanvas(false);
window.addEventListener("resize", resizeCanvas, false);


function resizeCanvas(boxImgs = true) {
    if(window.innerWidth / window.innerHeight >= ratio) {
        pxWidth = Math.round(window.innerHeight * ratio);
        pxHeight = window.innerHeight;
        canvas.width = pxWidth;
        canvas.height = pxHeight;
    } else {
        pxWidth = window.innerWidth;
        pxHeight = Math.round(window.innerWidth / ratio);
        canvas.width = pxWidth;
        canvas.height = pxHeight;
    }

    if(boxImgs) {
        boxImages();
    }
}
// #endregion
// ----- CANVAS ----- //


// ----- IMAGES AND BOXES ----- //
// #region Images and boxes
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
            boxes[boxSpecs[i][0]]["left"] = pxWidth * boxSpecs[i][4] / fixedWidth;
            boxes[boxSpecs[i][0]]["top"] = pxHeight * boxSpecs[i][5] / fixedHeight;
            boxes[boxSpecs[i][0]]["right"] = pxWidth * boxSpecs[i][6] / fixedWidth;
            boxes[boxSpecs[i][0]]["bottom"] = pxHeight * boxSpecs[i][7] / fixedHeight;
            
            boxes[boxSpecs[i][0]]["center_x"] = (boxes[boxSpecs[i][0]]["left"] + boxes[boxSpecs[i][0]]["right"]) / 2;
            boxes[boxSpecs[i][0]]["center_y"] = (boxes[boxSpecs[i][0]]["top"] + boxes[boxSpecs[i][0]]["bottom"]) / 2;
        } else if(boxSpecs[i][3] == "CENTER") {
            let W, H;
            if(boxSpecs[i][6] == "W") {
                W = pxWidth * boxSpecs[i][7] / fixedWidth;
                H = W * images[boxSpecs[i][1]].height / images[boxSpecs[i][1]].width;
            } else {
                H = pxHeight * boxSpecs[i][7] / fixedHeight;
                W = H * images[boxSpecs[i][1]].width / images[boxSpecs[i][1]].height;
            }

            boxes[boxSpecs[i][0]]["left"] = pxWidth * boxSpecs[i][4] / fixedWidth - 0.5 * W;
            boxes[boxSpecs[i][0]]["top"] = pxHeight * boxSpecs[i][5] / fixedHeight - 0.5 * H;
            boxes[boxSpecs[i][0]]["right"] = pxWidth * boxSpecs[i][4] / fixedWidth + 0.5 * W;
            boxes[boxSpecs[i][0]]["bottom"] = pxHeight * boxSpecs[i][5] / fixedHeight + 0.5 * H;

            boxes[boxSpecs[i][0]]["center_x"] = pxWidth * boxSpecs[i][4] / fixedWidth;
            boxes[boxSpecs[i][0]]["center_y"] = pxHeight * boxSpecs[i][5] / fixedHeight;
        }

        boxes[boxSpecs[i][0]]["width"] = boxes[boxSpecs[i][0]]["right"] - boxes[boxSpecs[i][0]]["left"];
        boxes[boxSpecs[i][0]]["height"] = boxes[boxSpecs[i][0]]["bottom"] - boxes[boxSpecs[i][0]]["top"];

        boxes[boxSpecs[i][0]]["image"] = boxSpecs[i][1];
        boxes[boxSpecs[i][0]]["image_over"] = boxSpecs[i][2];
    }
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
//#endregion
// ----- IMAGES AND BOXES ----- //


// ----- LEVELS ----- //
// #region Levels
let levels = [];
levels[0] = { "": [] };
//#endregion
// ----- LEVELS ----- //


// ----- MOUSE ----- //
// #region Mouse
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
// #endregion
// ----- MOUSE ----- //


// ----- KEYBOARD ----- //
// #region Keyboard
let keyboardInfo = [];

function keyboardEvent(event) {
    keyboardInfo[event.key.toUpperCase()] = (event.type == "keydown");
}

document.addEventListener("keydown", keyboardEvent);
document.addEventListener("keyup", keyboardEvent);
// #endregion
// ----- KEYBOARD ----- //


// ----- GAME LOOP ----- //
// #region Game Loop
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

                // else if(mouseTestBox("home_set")) scene = "settings";
                // else if(mouseTestBox("home_inv")) scene = "inventory";
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

function draw() {
    game.fillStyle = "rgb(200, 250, 250)";
    game.fillRect(0, 0, pxWidth, pxHeight);

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
            game.font = "" + Math.round(pxWidth * 13 / fixedWidth * 0.6) + "px Library";
            game.textAlign = "center";
            game.textBaseline = "middle";
            for(let i = 1; i <= 16; i++) {
                let i7 = i >= 7 ? i + 1 : i;
                drawBox("levels_level_" + i);
                game.fillText(i7, boxes["levels_level_" + i].center_x, boxes["levels_level_" + i].center_y);
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
        pxWidth + " x " + pxHeight + " / " + 
        "MOUSE: (" + (mouseInfo["x"]) + ", " + (mouseInfo["y"]) + ") " + 
        "fixed (" + (mouseInfo["x"] / pxWidth * fixedWidth) + ", " + (mouseInfo["y"] / pxHeight * fixedHeight) + ")";
    game.fillText(text, 8, 4);
}
// #endregion
// ----- GAME LOOP ----- //