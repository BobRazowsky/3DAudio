/**
* Load the scene when the canvas is fully loaded
*/
document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        init3D();
    }
}, false);



function init3D() {

    window.addEventListener("resize", function(){
            engine.resize();
        });

    // Get canvas
    canvas = document.getElementById("renderCanvas");

    // Create babylon engine
    engine = new BABYLON.Engine(canvas, true);

    // Create scene
    scene = new BABYLON.Scene(engine);

    // Create the camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 1, Math.PI / 4, 50, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas);

    // Create light
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 2;

    // Let's try our built-in 'sphere' shape. Params: name, subdivisions, size, scene
    //var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    //sphere.position.y = 1;

    // Let's try our built-in 'ground' shape.  Params: name, width, depth, subdivisions, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);


    var bass = new BABYLON.Sound("bass", "./audio/05_BASS_03.wav", scene, null, {loop: false, autoplay: true});
    var snare = new BABYLON.Sound("snare", "./audio/08_SNARE_03.wav", scene, null, {loop: false, autoplay: true});
    var rimshot = new BABYLON.Sound("rimshot", "./audio/23_RIMSHOT.wav", scene, null, {loop: false, autoplay: true});
    var tom = new BABYLON.Sound("tom", "./audio/14_TOM_03.wav", scene, null, {loop: false, autoplay: true});
    var ride = new BABYLON.Sound("ride", "./audio/18_RIDE_01.wav", scene, null, {loop: false, autoplay: true});
    var crash = new BABYLON.Sound("crash", "./audio/20_CRASH.wav", scene, null, {loop: false, autoplay: true});
    var tamb = new BABYLON.Sound("tamb", "./audio/22_TAMB_02.wav", scene, null, {loop: false, autoplay: true});
    var shaker = new BABYLON.Sound("shaker", "./audio/25_SHAKER_02.wav", scene, null, {loop: false, autoplay: true});
    var clap = new BABYLON.Sound("clap", "./audio/26_CLAP.wav", scene, null, {loop: false, autoplay: true});


    // Start the analyser
    var myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.FFT_SIZE = 32;
    myAnalyser.SMOOTHING = 0.9;


    // var fft = myAnalyser.getByteFrequencyData();
    // console.log(fft);

    this.spatialBoxArray = [];
    var spatialBox;
    var color;
    
    for (var index = 0; index < myAnalyser.FFT_SIZE / 2; index++) {
        spatialBox = BABYLON.Mesh.CreateBox("sb" + index, 2, scene);
        spatialBox.position = new BABYLON.Vector3(index * 2, 0, 0);
        spatialBox.material = new BABYLON.StandardMaterial("sbm" + index, scene);
        //color = hsvToRgb(index / (myAnalyser.FFT_SIZE) / 2 * 360, 100, 50),
        //spatialBox.material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
        this.spatialBoxArray.push(spatialBox);
    }



    var updateSonograph = function() {
      fft = myAnalyser.getByteFrequencyData();
      //console.log(fft);

        for (var i = 0; i < 32 ; i++) {
             this.spatialBoxArray[i].scaling.y =  fft[i] / 32;
             //console.log("hello");
        }
      // for (var p = 0; p < sonoSize - 1; p++) {
      //   for (var j = 0; j < fftSize; j++) {
      //     pathArray[p + 1][j].y = pathArray[p][j].y * (1 - p / sonoSize * ratio);
      //   }
      // }
      // for (var i = 0; i < fftSize; i++) {
      //   (pathArray[0][i]).y = fft[i];
      // }
      // sonograph = BABYLON.MeshBuilder.CreateRibbon(null, {pathArray: pathArray, instance: sonograph}); 
    }.bind(this);



    //window.setInterval(updateSonograph, 66);

    var playSound = function(){
        var sound;

        switch(event.code){
            case "KeyQ":
                sound = bass;
                break;
            case "KeyW":
                sound = snare;
                break;
            case "KeyE":
                sound = rimshot;
                break;
            case "KeyR":
                sound = tom;
                break;
            case "KeyT":
                sound = ride;
                break;
            case "KeyY":
                sound = crash;
                break;
            case "KeyU":
                sound = tamb;
                break;
            case "KeyI":
                sound = shaker;
                break;
            case "KeyO":
                sound = clap;
                break;
            default:
                sound = bass;
        }

        sound.play();
        updateSonograph();
    }

    var hsvToRgb = function(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;

        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));

        s /= 100;
        v /= 100;

        if(s == 0) {
                r = g = b = v;
                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }

        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch(i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default: // case 5:
                r = v;
                g = p;
                b = q;
        }
        return {r: r, g: g, b: b};
    }


    // scene.registerBeforeRender(function () {
    //     var workingArray = myAnalyser.getByteFrequencyData();
    
    //     for (var i = 0; i < myAnalyser.getFrequencyBinCount() ; i++) {
    //         spatialBoxArray[i].scaling.y =  workingArray[i] / 32;
    //     }
    // });


    scene.render();

        
    engine.loadingUIBackgroundColor = "Purple";

    window.addEventListener("keypress", playSound);

}
    