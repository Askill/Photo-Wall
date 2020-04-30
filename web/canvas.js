var backgroundPath = "";
var backImg = new Image();
var framePaths = [];

backImg.src = backgroundPath;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasOffset = $("#canvas").offset();

var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var isDragging = false;
var isScaling = false;

var pictures = [];  // the array with picture objects
var focusedID = 0;  // id of focused object
var zoomLevel = 1;
var canMouseX;
var canMouseY;
var scale = 1;

var scaleRefPoints = [];
var pixelPerMeter = 0;
var scaleRefLenght = 1;
var showMeasurements = false;

// render "engine"
function draw() {
  prepareCanvas()
  // draw all picture objects
  pictures.forEach(function (item) {
    try {
      item.calcPassp();
      drawPassp(item);
      drawImage(item);
      drawFrame(item);
      drawMeasurements(item)
    }
    catch (error) {
      console.log(error);
    }
  });

  drawRuler();

  //residual from preparecanvas function
  ctx.restore();
}

function drawX(x, y) {
  ctx.moveTo(x - 5, y - 5);
  ctx.lineTo(x + 5, y + 5);
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.moveTo(x + 5, y - 5);
  ctx.lineTo(x - 5, y + 5);
  ctx.stroke();
}

function prepareCanvas() {
  // scales the image to fit on the canvas
  scale = canvasWidth / backImg.width;

  if (backImg.height > backImg.width) {
    scale = canvasHeight / backImg.height;
  }

  // offset for background to be centered
  let offsetx = (canvasWidth - backImg.width * scale) / 2;
  let offsety = (canvasHeight - backImg.height * scale) / 2;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  ctx.translate(canMouseX, canMouseY);
  ctx.scale(zoomLevel, zoomLevel);
  ctx.translate(-(canMouseX), -(canMouseY));
  ctx.drawImage(backImg, offsetx, offsety, backImg.width * scale, backImg.height * scale);

}

function drawPassp(item) {
  // draw passpatous 
  let img = item.img;
  ctx.fillStyle = item.passpColor;
  if (item.frameRotate) {
    ctx.save();
    ctx.translate(item.x + item.passpImg.width * item.passpScale / 2, item.y + item.passpImg.height * item.passpScale / 2); // change origin
    ctx.rotate(Math.PI / 2);
    ctx.translate(-(item.x + item.passpImg.width * item.passpScale / 2), -(item.y + item.passpImg.height * item.passpScale / 2)); // change origin

    ctx.fillRect(
      item.x - (item.passpImg.height * item.passpScale - (img.height * item.scale)) / 2 + item.passpOffset,
      item.y + (item.passpImg.width * item.passpScale - (img.width * item.scale)) / 2 + item.passpOffset,
      (item.passpImg.width * item.passpScale) - item.passpOffset * 2,
      (item.passpImg.height * item.passpScale) - item.passpOffset * 2);

    ctx.rotate(-Math.PI / 2);
    ctx.restore()
  }
  else {
    ctx.fillRect(
      item.x - (item.passpImg.width * item.passpScale - (img.width * item.scale)) / 2 + item.passpOffset,
      item.y - (item.passpImg.height * item.passpScale - (img.height * item.scale)) / 2 + item.passpOffset,
      (item.passpImg.width * item.passpScale) - item.passpOffset * 2,
      (item.passpImg.height * item.passpScale) - item.passpOffset * 2);
  }
}

function drawImage(item) {
  // draw image
  let img = item.img;
  ctx.save();
  ctx.translate(item.x + item.img.width * item.scale / 2, item.y + item.img.height * item.scale / 2); // change origin
  ctx.rotate(item.imgRotate);
  ctx.translate(-(item.x + item.img.width * item.scale / 2), -(item.y + item.img.height * item.scale / 2)); // change origin

  ctx.drawImage(img, item.x, item.y, img.width * item.scale, img.height * item.scale);

  ctx.rotate(item.imgRotate);
  ctx.restore()
}

function drawFrame(item) {
  // draw frame
  // if frame should be rotated
  let img = item.img;
  if (item.frameRotate) {
    ctx.save();
    ctx.translate(item.x + item.passpImg.width * item.passpScale / 2, item.y + item.passpImg.height * item.passpScale / 2); // change origin
    ctx.rotate(Math.PI / 2);
    ctx.translate(-(item.x + item.passpImg.width * item.passpScale / 2), -(item.y + item.passpImg.height * item.passpScale / 2)); // change origin

    ctx.drawImage(
      item.passpImg,
      item.x - (item.passpImg.height * item.passpScale - (img.height * item.scale)) / 2,
      item.y + (item.passpImg.width * item.passpScale - (img.width * item.scale)) / 2,
      item.passpImg.width * item.passpScale,
      item.passpImg.height * item.passpScale);

    ctx.rotate(-Math.PI / 2);
    ctx.restore()
  }
  else {
    ctx.drawImage(
      item.passpImg,
      item.x - (item.passpImg.width * item.passpScale - (img.width * item.scale)) / 2,
      item.y - (item.passpImg.height * item.passpScale - (img.height * item.scale)) / 2,
      item.passpImg.width * item.passpScale,
      item.passpImg.height * item.passpScale);
  }
}

function drawMeasurements(item) {

  if (showMeasurements) {
    // if on side
    ctx.fillStyle = "black";
    if (Math.round((item.imgRotate / (Math.PI / 2)) % 2) == 0) {
      ctx.fillText(Number((item.img.width * item.scale) / pixelPerMeter).toFixed(2),
        item.x + (item.img.width * item.scale) / 2 - 10,
        item.y + (item.img.height * item.scale) + 15);
      ctx.fillText(Number((item.img.height * item.scale) / pixelPerMeter).toFixed(2),
        item.x - 25,
        item.y + (item.img.height * item.scale) / 2);
    }
    else {
      ctx.fillText(Number((item.img.height * item.scale) / pixelPerMeter).toFixed(2),
        item.x + (item.img.width * item.scale) / 2,
        item.y + (item.img.height * item.scale) / 2 + (item.img.width * item.scale) / 2 + 10);
      ctx.fillText(Number((item.img.width * item.scale) / pixelPerMeter).toFixed(2),
        item.x + (item.getWidth() - item.getHeight()) / 2 - 25,
        item.y + item.getHeight() / 2);
    }

  }
}

function drawRuler() {
  // draw ruler
  if (isScaling) {
    ctx.beginPath();
    drawX(scaleRefPoints[0][0], scaleRefPoints[0][1]);
    ctx.moveTo(scaleRefPoints[0][0], scaleRefPoints[0][1]);
    if (scaleRefPoints[1] != null) {
      ctx.lineTo(scaleRefPoints[1][0], scaleRefPoints[1][1]);
      drawX(scaleRefPoints[1][0], scaleRefPoints[1][1])
    } else {
      ctx.lineTo(canMouseX, canMouseY);
    }
    ctx.stroke();
  }
}