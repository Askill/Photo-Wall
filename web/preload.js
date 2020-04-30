
window.onload = function () {
    loadBackgrounds();
    loadFrames();
}

function setBackground(item) {
    backgroundPath =  "./backgrounds/"
    updateSrc();
}

function loadBackgrounds() {
    let backgroundBase = "./backgrounds"
    let raw = './files.json'
    let paths
    $.getJSON(raw, function(data) {         
        paths = JSON.parse(data);
    });

    setBackground(paths[0]);

    paths.forEach(function (item) {
        let path = backgroundBase + "/" + item;
        let text = "Background " + item.split(".")[0];

        let string = `
        <div class="card text-white bg-dark mb-3 backgroundsNav" style="max-width: 18rem;" onClick="setBackground('${item}'); $(this).addClass('border-light').siblings().removeClass('border-light');" style="max-width: 20rem;">
                <div class="card-header customPictures"> ${text} </div>
    
                <div class="card-body">
                    <div class="slidecontainer">
                        <img src="${path}"></img >      
                    </div>
                </div>
                </div>
        `;
        let el = document.getElementById('wrapperBackground');
        el.innerHTML += string;

    });
}

function loadFrames() {
    let backgroundBase =  "./frames";
    let raw = backgroundBase + '/files.json';
    let paths

    $.getJSON(raw, function(data) {         
        paths = JSON.parse(data);
    });

    framePaths = Array.from(paths);
};

