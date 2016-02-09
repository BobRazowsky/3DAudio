document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
        console.log("nique");
        init();
    }
}, false);

function init(){
	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);

	var createScene = function(){



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

		var scene = new BABYLON.Scene(engine);

		this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 2, 40, new BABYLON.Vector3(15, 5, 0), scene);
	    this.camera.attachControl(canvas);
	    //this.camera.lowerBetaLimit = 0;
	    this.camera.upperBetaLimit = 1.50;
	    this.camera.lowerRadiusLimit = 10;
	    this.camera.upperRadiusLimit = 40;


	    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	    light.intensity = 2;

	    // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	    // sphere.position.y +=5;
	    // sphere.position.z +=5;
	    // sphere.material = new BABYLON.StandardMaterial("blue", scene);
	    // sphere.material.diffuseColor = new BABYLON.Color3(0,0,1);

	    var ground = BABYLON.Mesh.CreateGround("ground1", 200, 200, 4, scene);
	    ground.material = new BABYLON.StandardMaterial("ground", scene);
	    // var mirrorMaterial = new BABYLON.StandardMaterial("ground", scene);
	    // mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
	    // mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, 20.0);
	    // mirrorMaterial.reflectionTexture.level = 1;
	    // mirrorMaterial.reflectionTexture.renderList = [sphere];
	    // ground.material = mirrorMaterial;


	    
	    ground.material.diffuseColor = new BABYLON.Color3(0,0,0);
	    ground.material.specularColor = new BABYLON.Color3(.1,.1,.1);
	    ground.position.y += .1;

	    var bass = new BABYLON.Sound("bass", "./audio/05_BASS_03.wav", scene, null, {loop: false, autoplay: false});
	    var snare = new BABYLON.Sound("snare", "./audio/08_SNARE_03.wav", scene, null, {loop: false, autoplay: false});
	    var rimshot = new BABYLON.Sound("rimshot", "./audio/23_RIMSHOT.wav", scene, null, {loop: false, autoplay: false});
	    var tom = new BABYLON.Sound("tom", "./audio/14_TOM_03.wav", scene, null, {loop: false, autoplay: false});
	    var ride = new BABYLON.Sound("ride", "./audio/18_RIDE_01.wav", scene, null, {loop: false, autoplay: false});
	    var crash = new BABYLON.Sound("crash", "./audio/20_CRASH.wav", scene, null, {loop: false, autoplay: false});
	    var tamb = new BABYLON.Sound("tamb", "./audio/22_TAMB_02.wav", scene, null, {loop: false, autoplay: false});
	    var shaker = new BABYLON.Sound("shaker", "./audio/25_SHAKER_02.wav", scene, null, {loop: false, autoplay: false});
	    var clap = new BABYLON.Sound("clap", "./audio/26_CLAP.wav", scene, null, {loop: false, autoplay: false});
	    
	    var song = new BABYLON.Sound("song", "./audio/getLucky.mp3", scene, null, {loop: false, autoplay: true});



	    // Start the analyser
	    var myAnalyser = new BABYLON.Analyser(scene);
	    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
	    myAnalyser.FFT_SIZE = 32;
	    myAnalyser.SMOOTHING = 0.9;

	    this.spatialBoxArray = [];
	    var spatialBox;
	    var color;
	    
	    for (var index = 0; index < myAnalyser.FFT_SIZE / 2; index++) {
	        spatialBox = BABYLON.Mesh.CreateBox("sb" + index, 2, scene);
	        spatialBox.position = new BABYLON.Vector3((index * 2), 0, 0);
	        //spatialBox.scaling.z = 10;
	        spatialBox.material = new BABYLON.StandardMaterial("sbm" + index, scene);
	        spatialBox.material.alpha = .5;
	        color = hsvToRgb(index / (myAnalyser.FFT_SIZE) / 2 * 360, 100, 50),
	        spatialBox.material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
	        spatialBox.material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);

	        this.spatialBoxArray.push(spatialBox);
	        //ground.material.reflectionTexture.renderList.push(spatialBox);
	        //console.log(ground.material.reflectionTexture.renderList);
	    }



	    var updateSonograph = function() {
	      fft = myAnalyser.getByteFrequencyData();
	        for (var i = 0; i < myAnalyser.FFT_SIZE / 2 ; i++) {
	             this.spatialBoxArray[i].scaling.y =  fft[i] / 16 + 1;
	             //this.spatialBoxArray[i].material.alpha = fft[i]/16 + .3;
	        }
	    }.bind(this);



	    window.setInterval(updateSonograph, 10);

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
	        //updateSonograph();
	    }



	    window.addEventListener("keypress", playSound);

	    return scene;
	}

	var scene = createScene();
	scene.clearColor = new BABYLON.Color3(0, 0, 0);

	engine.runRenderLoop(function () {
		scene.render();
	 });

	window.addEventListener("resize", function () {
	    engine.resize();
	});


}

