function Picture(src, id) {
    this.id = id;
    this.src = src;
    this.x = 110;
    this.y = 110;

    this.img = new Image();
    this.img.src = this.src;
    this.imgRotate = Math.PI * 2;

    this.frame = "";
    this.passp = 20;
    this.passpImg = new Image();
    this.passpImg.src = this.frame;
    this.frameRotate = false;
    this.passpScale = 1;
    this.passpColor = "#FFFFFF";
    this.passpOffset = 3;

    this.calcPassp = function () {

        // check if image was rotated even number of times
        let imgRotate1 = Math.round((this.imgRotate / (Math.PI / 2)) % 2) == 0;

        let overlapping = this.frameRotate ^ imgRotate1;

        if (overlapping) {
            // scale the frame x percent bigger than the image
            this.passpScale = ((this.img.width * this.scale) * (1 + this.passp / 100)) / this.passpImg.width;

            // make sure image isn't bigger than frame in any dimension 
            if (this.img.height * this.scale > this.passpImg.height * this.passpScale) {
                this.passpScale = ((this.img.height * this.scale) * (1 + this.passp / 100)) / this.passpImg.height;
            }
        }
        // if frame or image is rotated switch width and height 
        else {
            // scale the frame x percent bigger than the image
            this.passpScale = ((this.img.height * this.scale) * (1 + this.passp / 100)) / this.passpImg.width;

            // make sure image isn't bigger than frame in any dimension
            if (this.img.width * this.scale > this.passpImg.height * this.passpScale) {
                this.passpScale = ((this.img.width * this.scale) * (1 + this.passp / 100)) / this.passpImg.height;
            }
            if (this.img.height * this.scale > this.passpImg.width * this.passpScale) {
                this.passpScale = ((this.img.height * this.scale) * (1 + this.passp / 100)) / this.passpImg.width;
            }
        }
        if (this.passpScale === Infinity || this.passpScale === NaN) {
            this.passpScale = 1;
        }
    }

    this.refreshSrc = function () {
        this.img = new Image();
        this.img.src = this.src;

        this.passpImg = new Image();
        this.passpImg.src = this.frame;
    }
    this.scale = 1;
    this.calcScale = function () {
        let value = ((canvasWidth * 30) / 100) / this.img.width;
        this.scale = value.toFixed(2);
        document.getElementById("scale" + id).value = Number(value * 100).toFixed(2);
        document.getElementById("scaleInput" + id).value = Number(value * 100).toFixed(2);
    }
    this.img.addEventListener('load', this.calcScale.bind(this), false);

    this.getWidth = function () {
        return this.img.width * this.scale;
    }
    this.getHeight = function () {
        return this.img.height * this.scale;
    }
    this.isRotated = function(){
        return Math.round((this.imgRotate / (Math.PI / 2)) % 2) == 0;
    }
}

