document.addEventListener("DOMContentLoaded", function () {
    if (BABYLON.Engine.isSupported()) {
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
	    var atari = new BABYLON.Sound("clap", "./audio/atari2.mp3", scene, null, {loop: false, autoplay: false});
	    var atari2 = new BABYLON.Sound("clap", "./audio/atari3.mp3", scene, null, {loop: false, autoplay: false});
	    
	    var song = new BABYLON.Sound("song", "./audio/getLucky.mp3", scene, null, {loop: false, autoplay: false});



	    // Start the analyser
	    var myAnalyser = new BABYLON.Analyser(scene);
	    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
	    myAnalyser.FFT_SIZE = 128;
	    myAnalyser.SMOOTHING = 0.9;

	    this.spatialBoxArray = [];
	    var spatialBox;
	    var color;
	    var boxSize = .5;

	    for (var index = 0; index < myAnalyser.FFT_SIZE / 2; index++) {
	        spatialBox = BABYLON.Mesh.CreateBox("sb" + index, boxSize, scene);
	        spatialBox.position = new BABYLON.Vector3((index * boxSize), 0, 0);
	        //spatialBox.scaling.z = 10;
	        spatialBox.material = new BABYLON.StandardMaterial("sbm" + index, scene);
	        spatialBox.material.alpha = .5;
	        color = hsvToRgb(index / (myAnalyser.FFT_SIZE) / 2 * 360, 100, 50),
	        //color = hsvToRgb(223, index / (myAnalyser.FFT_SIZE) / 2 * 360, 50),
	        // spatialBox.material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
	        // spatialBox.material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);

	        this.spatialBoxArray.push(spatialBox);
	        //ground.material.reflectionTexture.renderList.push(spatialBox);
	        //console.log(ground.material.reflectionTexture.renderList);
	    }

	    console.log(document.AudioEngine);

	    var updateSonograph = function() {
	      fft = myAnalyser.getByteFrequencyData();
	        for (var i = 0; i < myAnalyser.FFT_SIZE / 2 ; i++) {
	             this.spatialBoxArray[i].scaling.y =  fft[i] / 8 + 1;
	             //this.spatialBoxArray[i].material.alpha = fft[i]/16 + .3;
	        }
	    }.bind(this);

	    var basicBeat = {
    		measures : 1,
    		elements: [
    			{sound: bass, positions: [0,2,4,6]},
	    		{sound: snare, positions: [2,6]}
    		]
    	};

	    var superBeat = {
    		measures : 1,
    		elements: [
    			{sound: bass, positions: [0,4]},
		    	{sound: snare, positions: [2,6]},
		    	{sound: rimshot, positions: [1,3,5,7]}
    		]
    	};

	    var gigaBeat = {
    		measures : 2,
    		elements: [
    			{sound: bass, positions: [0,4,5,7,8,12]},
		    	{sound: snare, positions: [2,5,6,10,14]},
		    	{sound: tamb, positions: [1,3,5,7,9,11,13,15]},
		    	{sound: rimshot, positions: [1,3,5,5.5,6,7]},
		    	{sound: crash, positions: [7]},
		    	// {sound: atari, positions: [0]},
		    	// {sound: atari2, positions: [12]}
    		]
    	};

	    var playBeat = function(beat, repeats){

	    	var tempo = 110;
		    var eightNoteTime = (60/tempo) / 2;

		    var measures = beat.measures;

		    for(var bar = 0; bar < repeats; bar++){

		    	var time = bar * (8 * measures) * eightNoteTime;	

		    	for(var i = 0; i < beat.elements.length; i++){

		    		var sound = beat.elements[i].sound;

		    		for(var j = 0; j < beat.elements[i].positions.length; j++){

		    			sound.play(time + beat.elements[i].positions[j] * eightNoteTime);

		    		}
		    	}
		    }
	    }

	    var metronome = function(){
	    	var ticTac = new BABYLON.Sound("tictac", "./audio/02_METRONOME_02.wav", scene, function () {
			  // Sound has been downloaded & decoded
			  playTempo();
			 }, 
			 {loop: false, autoplay: false});

	    	//var startTime = Date.now();
	    	//console.log(startTime);

	    	var playTempo = function(){
	    		var tempo = 120;
		    	var eightNoteTime = (60/tempo) / 2;

		    	for(var bar = 0; bar < 2; bar++){

		    		var time = bar * 16 * eightNoteTime;	
		    		ticTac.play(time);
		    		ticTac.play(time + 2 * eightNoteTime);
		    		ticTac.play(time + 4 * eightNoteTime);
		    		ticTac.play(time + 6 * eightNoteTime);

		    	}
	    	}
	    }


	    window.setInterval(updateSonograph, 10);

	    var playSound = function(){
	        var sound;

	        //console.log(event.keyCode);

	        switch(event.keyCode){
	            case 97:
	                sound = bass;
	                break;
	            case 122:
	                sound = snare;
	                break;
	            case 101:
	                sound = rimshot;
	                break;
	            case 114:
	                sound = tom;
	                break;
	            case 116:
	                sound = ride;
	                break;
	            case 121:
	                sound = crash;
	                break;
	            case 117:
	                sound = tamb;
	                break;
	            case 105:
	                sound = shaker;
	                break;
	            case 111:
	                sound = clap;
	                break;
	            case 115:
	                song.stop();
	                break;
	            case 112:
	                sound = song;
	                break;
	            case 113:
	                sound = atari;
	                break;
	            case 100:
	                sound = atari2;
	                break;
	            case 109:
	                playBeat(gigaBeat, 2);
	                break;
	            default:
	                sound = bass;
	        }

	        if(event.keyCode != 115 && event.keyCode != 109){
	        	sound.play();
	        }

	        
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

