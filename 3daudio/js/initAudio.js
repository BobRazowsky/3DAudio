var bass;
var snare;
var rimshot;
var bufferLoader;



var RhythmSample = {};

RhythmSample.playSound = function(){
	source = context.createBufferSource();
	var buffer;

	console.log(event);
	switch(event.code){
		case "KeyQ":
			buffer = bass;
			break;
		case "KeyW":
			buffer = snare;
			break;
		case "KeyE":
			buffer = rimshot;
			break;
		case "KeyR":
			buffer = tom;
			break;
		case "KeyT":
			buffer = ride;
			break;
		case "KeyY":
			buffer = crash;
			break;
		case "KeyU":
			buffer = tamb;
			break;
		case "KeyI":
			buffer = shaker;
			break;
		case "KeyO":
			buffer = clap;
			break;
		default:
			buffer = bass;
	}
	source.buffer = buffer;

	source.connect(context.destination);
	if(!source.start){
		source.start = source.noteOn;
	}

	source.start(0);
}

this.context = new AudioContext();
this.bassOn = true;

bufferLoader = new BufferLoader(
    context,
    [
        './audio/05_BASS_03.wav',
        './audio/08_SNARE_03.wav',
        './audio/23_RIMSHOT.wav',
        './audio/14_TOM_03.wav',
        './audio/18_RIDE_01.wav',
        './audio/20_CRASH.wav',
        './audio/22_TAMB_02.wav',
        './audio/25_SHAKER_02.wav',
        './audio/26_CLAP.wav',
    ],
    finishedLoading
);

bufferLoader.load();

function finishedLoading(bufferList){
    bass = bufferList[0];
    snare = bufferList[1];
    rimshot = bufferList[2];
    tom = bufferList[3];
    ride = bufferList[4];
    crash = bufferList[5];
    tamb = bufferList[6];
    shaker = bufferList[7];
    clap = bufferList[8];

    //RhythmSample.play();
}

//window.addEventListener("keypress", RhythmSample.playSound);





window.addEventListener("keypress", function() { RhythmSample.playSound(); });


    




