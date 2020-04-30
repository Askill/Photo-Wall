
$("#canvas").mousedown(function (e) { handleMouseDown(e); });
$("#canvas").mousemove(function (e) { handleMouseMove(e); });
$("#canvas").mouseup(function (e) { handleMouseUp(e); });
$("#canvas").mouseout(function (e) { handleMouseOut(e); });

function openNav() { document.getElementById("mySidenav").style.width = "350px"; }
function closeNav() { document.getElementById("mySidenav").style.width = "0"; }
function openNavR() { document.getElementById("mySidenavR").style.width = "350px"; }
function closeNavR() { document.getElementById("mySidenavR").style.width = "0"; }


window.addEventListener('resize', calcOffset);

function calcOffset(){
    //resizeCanvas();
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvasOffset = $("#canvas").offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
}

$(document).keydown(function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
        pictures[focusedID].y = pictures[focusedID].y - 1;
    }
    else if (e.keyCode == '40') {
        // down arrow
        pictures[focusedID].y = pictures[focusedID].y + 1;
    }
    else if (e.keyCode == '37') {
        // left arrow
        pictures[focusedID].x = pictures[focusedID].x - 1;
    }
    else if (e.keyCode == '39') {
        // right arrow
        pictures[focusedID].x = pictures[focusedID].x + 1;
    }

})


function handleMouseDown(e) {
    switch (e.which) {
        case 3: setZoomLevel(2); break;
    }

    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // set the drag flag
    isDragging = true;

    // focuse on clicked image
    let clickedID = -1;
    if (e.which == 1) {
        pictures.forEach(function (item) {
            if (item.x <= canMouseX && item.y <= canMouseY) {
                if (item.img.width * item.scale + item.x >= canMouseX && item.img.height * item.scale + item.y >= canMouseY) {
                    clickedID = item.id;
                    
                }
            }
        });
    }

    if(clickedID != -1){
        focusThis(clickedID);
    }
    else{
        removeFocus(focusedID);
    }

    focusedID = clickedID;
    
}

function handleMouseUp(e) {
    switch (e.which) {
        case 3: setZoomLevel(1); break;
    }

    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // clear the drag flag
    isDragging = false;
}

function handleMouseOut(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
}

function handleMouseMove(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);

    // if the drag flag is set, clear the canvas and draw the image
    if (isDragging && zoomLevel == 1 && !isScaling) {
        let pic = pictures[focusedID];
        if(focusedID != -1){
            pictures[focusedID].x = canMouseX - pic.img.width * pic.scale / 2;
            pictures[focusedID].y = canMouseY - pic.img.height * pic.scale / 2;
        }

    }
    draw();
}

function getMousePos(e){
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    return [canMouseX, canMouseY]
}