function mask(){
    var maskCanvas = document.getElementById("maskCanvas");
    maskCanvas.width = window.innerWidth;
    maskCanvas.height = window.innerHeight;
    var centerX = maskCanvas.width / 2;
    var centerY = maskCanvas.height / 2;
    var radius = 70;

    var ctx = maskCanvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,maskCanvas.width, maskCanvas.height);

    ctx.globalCompositeOperation = 'xor';

    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();

    console.log("mask");
}

mask();