// Settings
iconHeight = 200;
frameWidth = 300; // Also icon width
frameHeight = 500;
frameBorder = 25;
bgColor = "black";
frameColor = "white";

spinSpeed = 30;
spinSlowdown = 2; // Higher means longer spins
spinSlowdownDelay = 40; // Frames to wait before slowing down
// Create canvas size based on frame settings
gameWidth = frameBorder + frameBorder + frameBorder + frameBorder + frameWidth + frameWidth + frameWidth;
gameHeight = frameBorder + frameBorder + frameHeight;

c = document.getElementById("myCanvas");
ctx = c.getContext("2d");

c.width = gameWidth;
c.height = gameHeight;

var icons = ["banana.png", "bell.png", "cherry.png", "clover.png", "diamond.png", "dollar.png", "seven.png", "star.png", "watermelon.png"];
spinning = false;
viewMsg = false;
frameCount = 0;

createIcons();

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

main();

function createIcons() {
    icon1Ready = false;
    icon1 = new Image();
    icon1Index = Math.floor(Math.random() * icons.length);
    icon1.src = "media/" + icons[icon1Index];
    icon1.onload = function() {
        icon1Ready = true;
    }
    icon1PosY = Math.floor(Math.random() * frameHeight);
    icon1Speed = 0;

    icon2Ready = false;
    icon2 = new Image();
    icon2Index = Math.floor(Math.random() * icons.length);
    icon2.src = "media/" + icons[icon2Index];
    icon2.onload = function() {
        icon2Ready = true;
    }
    icon2PosY = Math.floor(Math.random() * frameHeight);
    icon2Speed = 0;

    icon3Ready = false;
    icon3 = new Image();
    icon3Index = Math.floor(Math.random() * icons.length);
    icon3.src = "media/" + icons[icon3Index];
    icon3.onload = function() {
        icon3Ready = true;
    }
    icon3PosY = Math.floor(Math.random() * frameHeight);
    icon3Speed = 0;
}
function main() {
    render();
    requestAnimationFrame(main);
}
function render() {
    frameCount++;
    if (viewMsg == false) {
        drawFrame();
        drawIcons();
        drawBg();
    }
    if (icon1Speed == 0 && icon2Speed == 0 && icon3Speed == 0 && spinning) {
        endSpin();
    }   
}
function drawFrame() {
    ctx.fillStyle = frameColor;
    ctx.fillRect(frameBorder, frameBorder, frameWidth, frameHeight);
    ctx.fillRect(frameBorder + frameBorder + frameWidth, frameBorder, frameWidth, frameHeight);
    ctx.fillRect(frameBorder + frameBorder + frameBorder + frameWidth + frameWidth, frameBorder, frameWidth, frameHeight);
}
function drawIcons() {
    if (icon1Ready) {
        ctx.drawImage(icon1, frameBorder, icon1PosY, frameWidth, iconHeight);  
        if (spinning) {            
            icon1PosY += icon1Speed;
            if (frameCount > spinSlowdownDelay && icon1Speed > 0 && (frameCount % spinSlowdown) == 0 && icon1PosY >= 0 && icon1PosY < (gameHeight - iconHeight)) icon1Speed--;        
            if (icon1PosY > gameHeight) {
                icon1PosY = 0 - iconHeight;
                icon1Index++;
                if (icon1Index >= icons.length) icon1Index = 0;
                icon1.src = "media/" + icons[icon1Index];
            }
        }
    }
    if (icon2Ready) {
        ctx.drawImage(icon2, frameBorder + frameBorder + frameWidth, icon2PosY, frameWidth, iconHeight);
        if (spinning) {
            icon2PosY += icon2Speed;
            if (frameCount > spinSlowdownDelay && icon1Speed == 0 && icon2Speed > 0 && (frameCount % spinSlowdown) == 0 && icon2PosY >= 0 && icon2PosY < (gameHeight - iconHeight)) icon2Speed--;        
            if (icon2PosY > gameHeight) {
                icon2PosY = 0 - iconHeight;
                icon2Index++;
                if (icon2Index >= icons.length) icon2Index = 0;
                icon2.src = "media/" + icons[icon2Index];
            }  
        }      
    }
    if (icon3Ready) {
        ctx.drawImage(icon3, frameBorder + frameBorder + frameBorder + frameWidth + frameWidth, icon3PosY, frameWidth, iconHeight);
        if (spinning) {
            icon3PosY += icon3Speed;
            if (frameCount > spinSlowdownDelay && icon1Speed == 0 && icon2Speed == 0 && icon3Speed > 0 && (frameCount % spinSlowdown) == 0 && icon3PosY >= 0 && icon3PosY < (gameHeight - iconHeight)) icon3Speed--;        
            if (icon3PosY > gameHeight) {
                icon3PosY = 0 - iconHeight;
                icon3Index++;
                if (icon3Index >= icons.length) icon3Index = 0;
                icon3.src = "media/" + icons[icon3Index];
            }
        }        
    }
}
function drawBg() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, gameWidth, frameBorder);
    ctx.fillRect(0, gameHeight - frameBorder, gameWidth, frameBorder);
    ctx.fillRect(0, 0, frameBorder, gameHeight);
    ctx.fillRect(frameWidth + frameBorder, 0, frameBorder, gameHeight);
    ctx.fillRect(frameWidth + frameWidth + frameBorder + frameBorder, 0, frameBorder, gameHeight);
    ctx.fillRect(gameWidth - frameBorder, 0, frameBorder, gameHeight);
}
function endSpin() {
    spinning = false;
    document.getElementById("spinAudio").pause();
    if (icon1.src == icon2.src && icon2.src == icon3.src) playerWin();    
    else if (icon1.src == icon2.src) playerWin();
    else if (icon1.src == icon3.src) playerWin();
    else if (icon2.src == icon3.src) playerWin();
    else playerLose();
}
function playerWin() {
    document.getElementById("spinWinAudio").play();
    playerMessage("YOU WIN.");
}
function playerLose() {
    document.getElementById("spinLoseAudio").play();
    playerMessage("YOU LOSE.");
}
function playerMessage(msg) {
    viewMsg = true;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(msg, gameWidth/2, gameHeight/2);
}
function playerSpin() {
    createIcons();
    frameCount = 0;
    spinning = true;
    viewMsg = false;
    document.getElementById("spinAudio").play();
    icon1Speed = spinSpeed;
    icon2Speed = spinSpeed;
    icon3Speed = spinSpeed;
}
// Button Handler
document.getElementById("buttonSpin").addEventListener("click",playerSpin);
document.addEventListener("keyup",function(e) {
    if (e.code == "Space") playerSpin();
});