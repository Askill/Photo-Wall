
// drawing loop
setInterval(draw, 10);
setInterval(showDimInHeader, 200);
function updateSrc() {
    backImg.src = backgroundPath;
}

function getHighestId(pics) {
    let highest = -1;
    pics.forEach(function (item) {
        if (item.id > highest) {
            highest = item.id;
        }
    });
    return highest;
}

function refreshControlls() {
    pictures.forEach(function (item) {
        let id = item.id;
        scalePic(id, item.scale * 100);
        scalePassp(id, item.passp);
        scalePasspOffset(id, item.passpOffset);
        if (showMeasurements) {
            document.getElementById("measurementToggle" + id).checked = true;
        }
    });
}

function addPicture() {
    imgPath = document.getElementById("addPicture").files[0].path;
    let id = getHighestId(pictures) + 1;
    let pic = new Picture(imgPath, id);
    addPicControll(imgPath, id);
    pictures[id] = pic;
    focusThis(id);
    refreshControlls();
}

function changeBackground() {
    backImg.src = document.getElementById("changeBackground").files[0].path;
}

function scalePic(id, value) {
    pictures[id].scale = value / 100;
    document.getElementById("scale" + id).value = value;
    document.getElementById("scaleInput" + id).value = value;
}

function scalePassp(id, value) {
    pictures[id].passp = Number(value);
    document.getElementById("passp" + id).value = value;
    document.getElementById("passpInput" + id).value = value;
}

function scalePasspOffset(id, value) {
    pictures[id].passpOffset = Number(value);
    document.getElementById("passpOffset" + id).value = value;
    document.getElementById("passpInputOffset" + id).value = value;
}

function focusThis(id) {
    focusedID = id;
    $("#controllWrapper"+id).addClass('border-light').siblings().removeClass('border-light');
}

function removeFocus(id) {
    $("#controllWrapper"+id).removeClass('border-light');
}

function showDimInHeader() {
    pictures.forEach(function (item) {
        let id = item.id;
        let std = "Picture " + id;
        if (showMeasurements) {
            document.getElementById("measurementToggle" + id).checked = true;
            
            let value = "";
            let width = Number(item.getWidth() / pixelPerMeter).toFixed(2);
            let height = Number(item.getHeight() / pixelPerMeter).toFixed(2);
            if (!pictures[id].isRotated()) {
                value = ' ' + width + 'm x ' + height + 'm';
            }
            else {
                value = ' ' + height + 'm x ' + width + 'm';
            }
            std += '<small>' + value + '</small>';
        }
        
        document.getElementById("picTitle" + id).innerHTML = std;
        
    });

}

// adds the controll interface for pictures
function addPicControll(src, id) {
    let frameListString = '<option selected="">frameless</option>';
    // add the frame choices
    framePaths.forEach(function (item) {
        let i = item.split(".")[0];
        frameListString += `<option value=${item}>${i}</option>`;
    })

    let frame = `
    <div class="form-group" >
      <select class="custom-select"  onchange="updateFrame(${id}, this.value)">
        ${frameListString}
      </select>
    </div>
    `

    let string = `
    <div class="card text-white bg-secondary mb-3 picControll" id="controllWrapper${id}" onClick="focusThis(${id});" style="max-width: 20rem;">
              <div class="card-header customPictures" id="cardHeader${id}"> 
              <button class="btn btn-link collapseHeader" type="button" data-toggle="collapse" data-target="#collapse${id}" aria-expanded="true" aria-controls="collapse${id}">
                <div class="picTitle" id="picTitle${id}">Picture ${id}</div>
              </button>
               <button type="button" class="close btn" data-dismiss="alert" onClick="removeElement(${id})">&times;</button></div>
  
               <div id="collapse${id}" class="collapse show" aria-labelledby="cardHeader${id}" data-parent="#accordionExample">
              <div class="card-body">
                  <div class="slidecontainer">
  
                      <img src="${src}"></img >

                      <div class="form-group">
                          Scale:
                          <div>
                            <input type="range" min="0" max="200" value="100" class="custom-range" id="scale${id}" onchange="scalePic(${id}, this.value)" oninput="scalePic(${id}, this.value)">
                            <input type="number" min="0" max="200" value="100" class="sliderAddInput form-control form-control-sm" placeholder="1.0" id="scaleInput${id}" oninput="scalePic(${id}, this.value)">
                          </div>
                      </div>
  
                      ${frame}
  
                      <div class="form-group">
                          Passpatous:
                          <div>
                            <input type="range" min="0" max="100" value="20" class="custom-range" id="passp${id}" onchange="scalePassp(${id}, this.value)" oninput="scalePassp(${id}, this.value)">
                            <input type="number" min="0" max="100" value="20" class="sliderAddInput form-control form-control-sm" placeholder="1.0" id="passpInput${id}" oninput="scalePassp(${id}, this.value)">
                          </div>
                      </div>

                      <div class="form-group">
                          Passpatous Offset:
                          <div class="form-group">
                            <input type="range" min="0" max="50" value="3" class="custom-range" id="passpOffset${id}" onchange="scalePasspOffset(${id}, this.value)" oninput="scalePasspOffset(${id}, this.value)">
                            <input type="number" min="0" max="50" value="3" class="sliderAddInput form-control form-control-sm" placeholder="1.0" id="passpInputOffset${id}" oninput="scalePasspOffset(${id}, this.value)">
                          </div>
                      </div>
  
                      <div class="form-group">
                        <div class="custom-control custom-switch cstm-btn">
                          <button type="button" class="btn btn-primary btn-sm" id="rotateImg${id}"  onclick="rotateImg(${id})"><i class="fas fa-redo fa-xs"></i></button>
                          <label   for="rotateImg${id}"> rotate image</label>
                        </div>
                      </div>
  
                      <div class="form-group">
                        <div class="custom-control custom-switch cstm-btn">
                          <button type="button" class="btn btn-primary btn-sm" id="rotateFrame${id}" onclick="rotateFrame(${id})"><i class="fas fa-redo fa-xs"></i></button>
                          <label for="rotateFrame${id}">rotate frame</label>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="measurementToggle${id}" onchange="toggleShowMeasurements()">
                            <label class="custom-control-label" for="measurementToggle${id}">show measurements</label>
                        </div>
                    </div>
  
  
                  </div>
                  </div>
              </div>
            </div>
    `;
    let el = document.getElementById('wrapper');
    el.innerHTML += string;
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById("controllWrapper" + elementId);
    element.parentNode.removeChild(element);
    delete pictures[elementId];
}

// called on change, sets the frame of the calling object
function updateFrame(id, value) {
    let backgroundBase = path.join(__dirname, "./frames/");

    pictures[id].passpImg.src = backgroundBase + value;
    pictures[id].frame = backgroundBase + value;
    pictures[id].refreshSrc();
}

function rotateFrame(id) {
    pictures[id].frameRotate = !pictures[id].frameRotate;
}

function rotateImg(id) {
    pictures[id].imgRotate += Math.PI / 2;
}

function setZoomLevel(x) {
    zoomLevel = x * scale;
    //reset zoom re-center
    if (x == 1) {
        canMouseX = canvasWidth / 2;
        canMouseY = canvasHeight / 2;
        zoomLevel = 1;
    }
}

window.addEventListener('setScale', function (e) {
    canvas.style.cursor = "crosshair";

    canvas.addEventListener('mousedown', startScale);

    function startScale() {
        canvas.removeEventListener('mousedown', startScale);

        scaleRefPoints.push([canMouseX, canMouseY]);
        isScaling = true;
        canvas.addEventListener('mouseup', endScale);
    };

    function endScale() {
        canvas.removeEventListener('mouseup', endScale);
        scaleRefPoints.push([canMouseX, canMouseY]);

        canvas.style.cursor = "default";
        prompt({
            title: 'Scale',
            label: 'Distance measured in meters',
            value: '1',
            inputAttrs: {
                type: 'number'
            },
            type: 'input'
        })
            .then((r) => {
                if (r === null) {
                    isScaling = false;
                    scaleRefPoints = [];
                    console.log('user cancelled');
                } else {
                    //TODO check if input number and truncate to number if not
                    isScaling = false;
                    scaleRefLenght = r;
                    pixelPerMeter = calcPythDist(scaleRefPoints[0], scaleRefPoints[1]) / scaleRefLenght;
                    console.log(pixelPerMeter);
                    scaleRefPoints = [];
                    showMeasurements = true;
                    showDimInHeader();
                    console.log('result', r);
                }
            })
            .catch(console.error);
    };
});

function calcPythDist(point1, point2) {
    let a = point2[0] - point1[0];
    let b = point2[1] - point1[1];
    return Math.sqrt((a * a) + (b * b))
}

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.9;
}

window.addEventListener('saveCanvas', function (e, path) {
    let canvas = document.getElementById("canvas");
    // Get the DataUrl from the Canvas
    const url = canvas.toDataURL('image/jpg', 0.8);

    // remove Base64 stuff from the Image
    const base64Data = url.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(path, base64Data, 'base64', function (err) {
        console.log(err);
    });
});

function toggleShowMeasurements() {
    showMeasurements = !showMeasurements;
    console.log(showMeasurements);
}
