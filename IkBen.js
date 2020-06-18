(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"IkBen_atlas_1", frames: [[4506,5010,2251,1667],[0,2087,2084,2084],[0,6259,2251,1668],[2086,2086,2251,1668],[0,4173,2084,2084],[2086,0,2084,2084],[4172,0,2251,1668],[2086,3756,2251,1668],[2253,5426,2251,1668],[4339,1670,2251,1668],[0,0,2084,2085],[4339,3340,2251,1668]]},
		{name:"IkBen_atlas_2", frames: [[0,5091,1459,1751],[2253,0,1460,1751],[2924,3506,1459,1751],[3715,0,1459,1751],[0,0,2251,1667],[2253,1753,1460,1751],[3715,1753,1459,1751],[0,3338,1460,1751],[4385,3506,1459,1751],[5176,0,1459,1751],[5176,1753,1459,1751],[5846,3506,1459,1751],[0,1669,2251,1667],[5175,5259,1855,1362],[5175,6623,1855,1362],[1461,5259,1855,1363],[1461,6624,1855,1362],[3318,6624,1855,1362],[3318,5259,1855,1363],[1462,3506,1460,1751]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.__alleman = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.__avonturier = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.__efficientstructuurgeordend = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.__grapjas = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.__gras = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.__koning = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.__bewustwakker = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.__nieuwedingenproberenmoedig = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.__kind = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.__voeder = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.__schepper = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.__liefhebber = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.__overgavebescheiden = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.__vrijbuiter = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.__tovenaar = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.__held = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.__leergierigflexibelgeduldig = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.__vurig = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.hat_white = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.hat_yellow = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.hat_red = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.hat_blue = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.hat_green = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.hat_black = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.__wijze = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.__zonnig = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.__bijjezelfblijvenreflecteren = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.__betrokkenverbindendhulpvaardig = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.__autonoomzichtbaar = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.__opentoegankelijkeerlijk = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.__koninglijk = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.__oordeelloosempatischrespectvol = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.Uitdaging10 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__nieuwedingenproberenmoedig();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Nieuwe dingen\nproberen, moedig, verantwoordelijk", "bold 38px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 48;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(144.05,294.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.9,54,320,507.5);


(lib.Uitdaging9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__autonoomzichtbaar();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Autonoom,\nzichtbaar zijn", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,482.79999999999995);


(lib.Uitdaging8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__betrokkenverbindendhulpvaardig();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Betrokken,\nVerbindend,\nHulpvaardig", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,482.79999999999995);


(lib.Uitdaging7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__efficientstructuurgeordend();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Efficiënt,\nStructuur,\nGeördend", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,474.5);


(lib.Uitdaging6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__leergierigflexibelgeduldig();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Leergierig,\nFlexibel,\nGeduldig", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,474.5);


(lib.Uitdaging5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__overgavebescheiden();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Overgave,\nBescheiden,\nBereidwillig", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,474.5);


(lib.Uitdaging4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__bewustwakker();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Bewust & wakker ten opzichte van anderen", "bold 46px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 58;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(144.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.9,54,320,474.5);


(lib.Uitdaging3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__oordeelloosempatischrespectvol();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Oordeelloos,\nempathisch,\nrespectvol zijn", "bold 46px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 58;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(144.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.9,54,320,474.5);


(lib.Uitdaging2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__bijjezelfblijvenreflecteren();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Bij jezelf blijven,\nReflecteren", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,474.5);


(lib.Uitdaging1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__opentoegankelijkeerlijk();
	this.instance.setTransform(-9,54,0.1371,0.1371);

	this.text = new cjs.Text("Open, \nToegankelijk, \nEerlijk zijn", "bold 48px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,294.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,54,320,474.5);


(lib.WarmGrasgroen = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__gras();
	this.instance.setTransform(-78,-74,0.2798,0.2798);

	this.text = new cjs.Text("Warm\nGras Groen", "bold 94px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 459;
	this.text.parent = this;
	this.text.setTransform(222.05,485.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78,-74,583.1,1022.7);


(lib.VurigOranje = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.instance = new lib.__vurig();
	this.instance.setTransform(-78,-74,0.2798,0.2798);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Laag_1
	this.text = new cjs.Text("Vurig\nOranje", "bold 80px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 100;
	this.text.lineWidth = 384;
	this.text.parent = this;
	this.text.setTransform(221.6,480.8);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78,-74,583.1,1018.5);


(lib.StralendGoudgeel = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__zonnig();
	this.instance.setTransform(-78,-74,0.2798,0.2798);

	this.text = new cjs.Text("Stralend\nGoud Geel", "bold 81px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 101;
	this.text.lineWidth = 384;
	this.text.parent = this;
	this.text.setTransform(194.05,477.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78,-74,583.1,1015.4);


(lib.HelderKoningsblauw = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__koninglijk();
	this.instance.setTransform(-78,-74,0.2798,0.2798);

	this.text = new cjs.Text("Helder Konings Blauw", "bold 86px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 107;
	this.text.lineWidth = 538;
	this.text.parent = this;
	this.text.setTransform(201,480.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-78,-74,583.1,1017.7);


(lib.slecht = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Slecht", "bold 94px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 448;
	this.text.parent = this;
	this.text.setTransform(226.05,102.55);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("EgjUAa4MAAAg1wMBGoAAAMAAAA1wg");
	this.shape.setTransform(226.05,172.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,452.1,344.1);


(lib.goed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Goed", "bold 94px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 448;
	this.text.parent = this;
	this.text.setTransform(226.05,102.55);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("EgjUAa4MAAAg1wMBGoAAAMAAAA1wg");
	this.shape.setTransform(226.05,172.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,452.1,344.1);


(lib.vrijbuiter = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__vrijbuiter();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Vrijbuiter/\nProvocateur", "bold 44px 'Calibri'");
	this.text.lineHeight = 56;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,228.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.3,538.7);


(lib.verzorger = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__voeder();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Verzorger/\nVoedster", "bold 49px 'Calibri'");
	this.text.lineHeight = 62;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(2,216.65);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.3,471.2);


(lib.tovenaar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.instance = new lib.__tovenaar();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	// Laag_1
	this.text = new cjs.Text("Tovenaar/\nMagiër", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,226.7);

	this.timeline.addTween(cjs.Tween.get(this.text).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.3,481.3);


(lib.schepper = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__schepper();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Schepper/\nKunstenaar", "bold 48px 'Calibri'");
	this.text.lineHeight = 61;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,228.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.6,538.2);


(lib.ontdekker = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__avonturier();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Ontdekker/\nAvonturier", "bold 45px 'Calibri'");
	this.text.lineHeight = 57;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(6,228.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.6,538.2);


(lib.onbevangenkind = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__kind();
	this.instance.setTransform(-48,40,0.2257,0.2257);

	this.text = new cjs.Text("Kind/Naïeveling", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 342;
	this.text.parent = this;
	this.text.setTransform(-39.9,379.45);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,40,351.8,478.1);


(lib.liefhebber = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__liefhebber();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Liefhebber/\nGeliefde", "bold 45px 'Calibri'");
	this.text.lineHeight = 57;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(2,216);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.3,526.2);


(lib.koning = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__koning();
	this.instance.setTransform(-56,44,0.2257,0.2257);

	this.text = new cjs.Text("Koning/\nKoningin", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(6,362.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-56,44,329.3,452.5);


(lib.held = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__held();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Held/\nStrijder", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,228.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.3,482.6);


(lib.grapjas = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__grapjas();
	this.instance.setTransform(-48,-121,0.2257,0.2257);

	this.text = new cjs.Text("Grapjas/\nNar", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,228.05);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,-121,329.3,538.2);


(lib.dewijze = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__wijze();
	this.instance.setTransform(-48,22,0.2024,0.2024);

	this.text = new cjs.Text("De wijze/\nDenker", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(6,362.9);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,22,295.5,474.5);


(lib.alleman = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.__alleman();
	this.instance.setTransform(-48,30,0.2257,0.2257);

	this.text = new cjs.Text("Alleman", "bold 50px 'Calibri'");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(6,374.95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-48,30,329.3,478.5);


(lib.zwartehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Negatief", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(150.25,329.65);

	this.instance = new lib.hat_black();
	this.instance.setTransform(-142,-47,0.313,0.313);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-142,-47,580.7,462.1);


(lib.wittehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Feitelijk", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 266;
	this.text.parent = this;
	this.text.setTransform(168.05,345.85);

	this.instance = new lib.hat_white();
	this.instance.setTransform(-140,-54,0.3198,0.3198);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-140,-54,593.3,485.3);


(lib.rodehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Op gevoel", "bold 63px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 79;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(150.25,318.85);

	this.instance = new lib.hat_red();
	this.instance.setTransform(-141,-51,0.3156,0.3156);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-141,-51,585.4,532.6);


(lib.groenehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Creatief", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(154.25,340.45);

	this.instance = new lib.hat_green();
	this.instance.setTransform(-141,-47,0.3149,0.3149);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-141,-47,584.2,472.9);


(lib.gelehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Positief", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(150.25,318.85);

	this.instance = new lib.hat_yellow();
	this.instance.setTransform(-145,-55,0.3182,0.3182);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-145,-55,590.2,459.3);


(lib.blauwehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Beschouwend", "bold 56px 'Calibri'");
	this.text.lineHeight = 70;
	this.text.lineWidth = 369;
	this.text.parent = this;
	this.text.setTransform(3.05,345.65);

	this.instance = new lib.hat_blue();
	this.instance.setTransform(-142,-56,0.3223,0.3223);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-142,-56,597.8,530.7);


(lib.volgende = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("volgende", "bold 72px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 90;
	this.text.lineWidth = 284;
	this.text.parent = this;
	this.text.setTransform(22,15.75);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("A9xKjIAA1FMAr4AAAIAAADIPrKaIwpKog");
	this.shape.setTransform(190.575,67.475);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#666666").s().p("A9xKjIAA1FMAr4AAAIAAADIPrKaIwpKog");
	this.shape_1.setTransform(190.575,67.475);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.text,p:{color:"#FFFFFF"}}]}).to({state:[{t:this.shape_1},{t:this.text,p:{color:"#FFFF33"}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,381.2,135);


(lib.selecte = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#999999").s().p("AIEQ5QhyhSj0ikQjrigh5hWQl6kPjtj3IAHgGQAxgrBihEQCRhkBSg2QB/hUBrg8QCOhQDwhtQAjgPARgJQAcgPATgRIAEgDIAtgSQAPBwAZCBQAXByAoClQA6DyBzGzQBXFJAoCFQAWBJA5CyQihh6iJhhgAn3rJIjnmYQgdgzgTgWQgFgHAAgEQAAgFAJgFQBMgyBGgiQBCD3ApCJQA/DTA+CmQgkg5hDh2g");
	this.shape.setTransform(103.3625,153.7875);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("ARUZsQhYg7hfgyQhNgnglgVQhig1hXhEIg0goQgegWgagLQgLgEgLgDIgUgOQhVg9m9kyQlEjfjFiZQkVjYjKjSQgcgegPgUQgUgegFgcQgIgwAjgoQAYgcAdgHIAEgGQAPgTAXgUIAsgiQBHgzCDhaICXhnQi9lejZleQgohAgMgkQgUg/AUgvQALgYAWgWQAPgPAdgWQCAhdCGhAQAugXAigGQAugKAiARQAdAOAVAiQAQAZAPAqQAtB4BSEhQBLEIA5COIAGAOIBcgtQBngxA7gfIALgKQAagXAygYQBbgsBpgbQArgMAbADQAbADAXAQQAWAQANAYIAEAIIACACQATAXAJAkQAFAUAEAvQANB9AeCZQAVBkAqCuQDYOADqLNIAKAlQANAwAMAyIAKA0QAFAegBAXIgQgDgAD/qoIgEADQgTAQgcAPQgRAJgjAQQjwBtiOBQQhrA8h/BTQhSA2iRBlQhiBEgxArIgHAHQDuD2F5EOQB5BXDrCgQD0CkByBRQCJBhChB7Qg5iygWhJQgoiFhXlKQhzmzg6jxQgoimgXhyQgZiAgPhwIgtASgAsq0YQgJAGAAAFQAAAEAFAGQATAXAdAzIDnGXQBDB2AkA6Qg+ing/jTQgpiIhCj4QhGAjhMAxg");
	this.shape_1.setTransform(106.5542,162.6139);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.selecte, new cjs.Rectangle(-5.9,-2,224.9,329.3), null);


// stage content:
(lib.IkBenFinalfla = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0,1,2,3,4,5];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var selected = 0;
		
		this.volgende.addEventListener("click", fl_MouseClickHandler_3.bind(this));
		
		this.selectarrow.x=3000;
		
		this.selectarrow.y=3000;
		
		
		function fl_MouseClickHandler_3()
		{
			if(selected!=0){
			this.play();
			}
		}
		
		this.zwart.addEventListener("click", fl_MouseClickHandler_6.bind(this));
		
		function fl_MouseClickHandler_6()
		{
			this.selectarrow.x=this.zwart.x;
			this.selectarrow.y=this.zwart.y;
			selected=1;
		}
		
		this.rood.addEventListener("click", fl_MouseClickHandler_7.bind(this));
		
		function fl_MouseClickHandler_7()
		{
			this.selectarrow.x=this.rood.x;
			this.selectarrow.y=this.rood.y;
			selected=2;
		}
		
		this.geel.addEventListener("click", kiesgeel.bind(this));
		
		function kiesgeel()
		{
			this.selectarrow.x=this.geel.x;
			this.selectarrow.y=this.geel.y;
			selected=3;
		}
		
		this.groen.addEventListener("click", kiesgroen.bind(this));
		
		function kiesgroen()
		{
			this.selectarrow.x=this.groen.x;
			this.selectarrow.y=this.groen.y;
			selected=4;
		}
		
		this.blauw.addEventListener("click", kiesblauw.bind(this));
		
		function kiesblauw()
		{
			this.selectarrow.x=this.blauw.x;
			this.selectarrow.y=this.blauw.y;
			selected=5;
		}
		
		this.wit.addEventListener("click", kieswit.bind(this));
		
		function kieswit()
		{
			this.selectarrow.x=this.wit.x;
			this.selectarrow.y=this.wit.y;
			selected=6;
		}
		this.stop();
	}
	this.frame_1 = function() {
		var q2selected = 0;
		
		this.volgende1.addEventListener("click", fl_MouseClickHandler_8.bind(this));
		
		this.selectarrow.x=3000;
		
		this.selectarrow.y=3000;
		
		
		function fl_MouseClickHandler_8()
		{
			if(q2selected!=0){
				this.play();
			}
		}
		
		this.archetype1.addEventListener("click", fl_MouseClickHandler_9.bind(this));
		
		function fl_MouseClickHandler_9()
		{
			q2selected=1;
			this.selectarrow.x=this.archetype1.x;
			this.selectarrow.y=this.archetype1.y;
		}
		
		this.archetype2.addEventListener("click", fl_MouseClickHandler_10.bind(this));
		
		function fl_MouseClickHandler_10()
		{
			q2selected=2;
			this.selectarrow.x=this.archetype2.x;
			this.selectarrow.y=this.archetype2.y;
		}
		
		this.archetype3.addEventListener("click", fl_MouseClickHandler_11.bind(this));
		
		function fl_MouseClickHandler_11()
		{
			q2selected=3;
			this.selectarrow.x=this.archetype3.x;
			this.selectarrow.y=this.archetype3.y;
		}
		
		this.archetype4.addEventListener("click", fl_MouseClickHandler_12.bind(this));
		
		function fl_MouseClickHandler_12()
		{
			q2selected=4;
			this.selectarrow.x=this.archetype4.x;
			this.selectarrow.y=this.archetype4.y;
		}
		
		this.archetype5.addEventListener("click", fl_MouseClickHandler_13.bind(this));
		
		function fl_MouseClickHandler_13()
		{
			q2selected=5;
			this.selectarrow.x=this.archetype5.x;
			this.selectarrow.y=this.archetype5.y;
		}
		
		this.archetype6.addEventListener("click", fl_MouseClickHandler_14.bind(this));
		
		function fl_MouseClickHandler_14()
		{
			q2selected=6;
			this.selectarrow.x=this.archetype6.x;
			this.selectarrow.y=this.archetype6.y;
		}
		
		this.archetype7.addEventListener("click", fl_MouseClickHandler_15.bind(this));
		
		function fl_MouseClickHandler_15()
		{
			q2selected=7;
			this.selectarrow.x=this.archetype7.x;
			this.selectarrow.y=this.archetype7.y;
		}
		
		this.archetype8.addEventListener("click", fl_MouseClickHandler_16.bind(this));
		
		function fl_MouseClickHandler_16()
		{
			q2selected=8;
			this.selectarrow.x=this.archetype8.x;
			this.selectarrow.y=this.archetype8.y;
		}
		
		this.archetype9.addEventListener("click", fl_MouseClickHandler_17.bind(this));
		
		function fl_MouseClickHandler_17()
		{
			q2selected=9;
			this.selectarrow.x=this.archetype9.x;
			this.selectarrow.y=this.archetype9.y;
		}
		
		this.archetype10.addEventListener("click", fl_MouseClickHandler_18.bind(this));
		
		function fl_MouseClickHandler_18()
		{
			q2selected=10;
			this.selectarrow.x=this.archetype10.x;
			this.selectarrow.y=this.archetype10.y;
		}
		
		this.archetype11.addEventListener("click", fl_MouseClickHandler_19.bind(this));
		
		function fl_MouseClickHandler_19()
		{
			q2selected=11;
			this.selectarrow.x=this.archetype11.x;
			this.selectarrow.y=this.archetype11.y;
		}
		
		this.archetype12.addEventListener("click", fl_MouseClickHandler_20.bind(this));
		
		function fl_MouseClickHandler_20()
		{
			q2selected=12;
			this.selectarrow.x=this.archetype12.x;
			this.selectarrow.y=this.archetype12.y;
		}
		this.stop();
	}
	this.frame_2 = function() {
		q3selected=0;
		this.selectarrow.x=3000;
		this.selectarrow.y=3000;
		
		this.volgende2.addEventListener("click", fl_MouseClickHandler_11.bind(this));
		
		function fl_MouseClickHandler_11()
		{
			if(q3selected!=0){
				this.play();
			}
		}
		
		this.goed.addEventListener("click", fl_MouseClickHandler_12.bind(this));
		
		function fl_MouseClickHandler_12()
		{
			q3selected=1; 
			this.selectarrow.x=this.goed.x; 
			this.selectarrow.y=this.goed.y; 
		
		}
		
		this.slecht.addEventListener("click", fl_MouseClickHandler_13.bind(this));
		
		function fl_MouseClickHandler_13()
		{
			q3selected=2; 
			this.selectarrow.x=this.slecht.x; 
			this.selectarrow.y=this.slecht.y; 
		}
		this.stop();
	}
	this.frame_3 = function() {
		var q4selected=0;
		this.selectarrow.x=3000;
		this.selectarrow.y=3000;
		
		
		this.vurig.addEventListener("click", fl_MouseClickHandler_14.bind(this));
		
		function fl_MouseClickHandler_14()
		{
		q4selected=1; 
		this.selectarrow.x=this.vurig.x; 
		this.selectarrow.y=this.vurig.y; 
		}
		
		this.stralend.addEventListener("click", fl_MouseClickHandler_15.bind(this));
		
		function fl_MouseClickHandler_15()
		{
		q4selected=2; 
		this.selectarrow.x=this.stralend.x; 
		this.selectarrow.y=this.stralend.y; 
		}
		
		this.helder.addEventListener("click", fl_MouseClickHandler_16.bind(this));
		
		function fl_MouseClickHandler_16()
		{
		q4selected=3; 
		this.selectarrow.x=this.helder.x; 
		this.selectarrow.y=this.helder.y; 
		}
		
		this.warm.addEventListener("click", fl_MouseClickHandler_17.bind(this));
		
		function fl_MouseClickHandler_17()
		{
		q4selected=4; 
		this.selectarrow.x=this.warm.x; 
		this.selectarrow.y=this.warm.y; 
		}
		
		this.volgende3.addEventListener("click", fl_MouseClickHandler_18.bind(this));
		
		function fl_MouseClickHandler_18()
		{
			if(q4selected!=0){
				this.play(); 
			}
		}
		this.stop();
	}
	this.frame_4 = function() {
		var q5selected=0;
		this.selectarrow.x=3000;
		this.selectarrow.y=3000;
		
		
		this.volgende4.addEventListener("click", fl_MouseClickHandler_30.bind(this));
		
		function fl_MouseClickHandler_30()
		{
			if(q5selected!=0){
				this.gotoAndStop(5);
			}
		}
		
		
		this.uitdaging1.addEventListener("click", fl_MouseClickHandler_19.bind(this));
		
		function fl_MouseClickHandler_19()
		{
			q5selected=1;
			this.selectarrow.x=this.uitdaging1.x; 
			this.selectarrow.y=this.uitdaging1.y; 
		}
		
		this.uitdaging2.addEventListener("click", fl_MouseClickHandler_21.bind(this));
		
		function fl_MouseClickHandler_21()
		{
			q5selected=2;
			this.selectarrow.x=this.uitdaging2.x; 
			this.selectarrow.y=this.uitdaging2.y; 
		}
		
		this.uitdaging3.addEventListener("click", fl_MouseClickHandler_22.bind(this));
		
		function fl_MouseClickHandler_22()
		{
			q5selected=3;
			this.selectarrow.x=this.uitdaging3.x; 
			this.selectarrow.y=this.uitdaging3.y; 
		}
		
		this.uitdaging4.addEventListener("click", fl_MouseClickHandler_25.bind(this));
		
		function fl_MouseClickHandler_25()
		{
			q5selected=4;
			this.selectarrow.x=this.uitdaging4.x; 
			this.selectarrow.y=this.uitdaging4.y; 
		}
		
		this.uitdaging5.addEventListener("click", fl_MouseClickHandler_23.bind(this));
		
		function fl_MouseClickHandler_23()
		{
			q5selected=5;
			this.selectarrow.x=this.uitdaging5.x; 
			this.selectarrow.y=this.uitdaging5.y; 
		}
		
		this.uitdaging6.addEventListener("click", fl_MouseClickHandler_24.bind(this));
		
		function fl_MouseClickHandler_24()
		{
			q5selected=6;
			this.selectarrow.x=this.uitdaging6.x; 
			this.selectarrow.y=this.uitdaging6.y; 
		}
		
		this.uitdaging7.addEventListener("click", fl_MouseClickHandler_26.bind(this));
		
		function fl_MouseClickHandler_26()
		{
			q5selected=7;
			this.selectarrow.x=this.uitdaging7.x; 
			this.selectarrow.y=this.uitdaging7.y; 
		}
		
		this.uitdaging8.addEventListener("click", fl_MouseClickHandler_27.bind(this));
		
		function fl_MouseClickHandler_27()
		{
			q5selected=8;
			this.selectarrow.x=this.uitdaging8.x; 
			this.selectarrow.y=this.uitdaging8.y; 
		}
		
		this.uitdaging9.addEventListener("click", fl_MouseClickHandler_28.bind(this));
		
		function fl_MouseClickHandler_28()
		{
			q5selected=9;
			this.selectarrow.x=this.uitdaging9.x; 
			this.selectarrow.y=this.uitdaging9.y; 
		}
		
		this.uitdaging10.addEventListener("click", fl_MouseClickHandler_29.bind(this));
		
		function fl_MouseClickHandler_29()
		{
			q5selected=10;
			this.selectarrow.x=this.uitdaging10.x; 
			this.selectarrow.y=this.uitdaging10.y; 
		}
		this.stop();
	}
	this.frame_5 = function() {
		this.selectarrow.x=3000;
		this.selectarrow.y=3000;
		
		this.saveresults.addEventListener("click", fl_MouseClickHandler_33.bind(this));
		
		function fl_MouseClickHandler_33()
		{
		this.play();
		}
		this.stop();
		
		this.answertextbox.text="willem wever";
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(1).call(this.frame_2).wait(1).call(this.frame_3).wait(1).call(this.frame_4).wait(1).call(this.frame_5).wait(1));

	// selectarrow
	this.selectarrow = new lib.selecte();
	this.selectarrow.name = "selectarrow";
	this.selectarrow.setTransform(2232.45,827.7,0.7669,0.7669,0,0,0,184.7,294.6);

	this.timeline.addTween(cjs.Tween.get(this.selectarrow).wait(6));

	// vraag
	this.text = new cjs.Text(" Hoe stel je je vaak op in discussies? ", "bold 94px 'Calibri'");
	this.text.lineHeight = 117;
	this.text.lineWidth = 1458;
	this.text.parent = this;
	this.text.setTransform(256.05,38.55);

	this.archetype12 = new lib.dewijze();
	this.archetype12.name = "archetype12";
	this.archetype12.setTransform(1759.95,689.1,0.8823,0.8823,0,0,0,106.7,213.6);
	new cjs.ButtonHelper(this.archetype12, 0, 1, 1);

	this.vurig = new lib.VurigOranje();
	this.vurig.name = "vurig";
	this.vurig.setTransform(282,424.7,0.9174,0.9174,0,0,0,218.1,218.2);
	new cjs.ButtonHelper(this.vurig, 0, 1, 1);

	this.stralend = new lib.StralendGoudgeel();
	this.stralend.name = "stralend";
	this.stralend.setTransform(730.4,412.7,0.9174,0.9174,0,0,0,218.1,205.1);
	new cjs.ButtonHelper(this.stralend, 0, 1, 1);

	this.helder = new lib.HelderKoningsblauw();
	this.helder.name = "helder";
	this.helder.setTransform(1212.85,420.7,0.9174,0.9174,0,0,0,231.2,213.8);
	new cjs.ButtonHelper(this.helder, 0, 1, 1);

	this.warm = new lib.WarmGrasgroen();
	this.warm.name = "warm";
	this.warm.setTransform(1662.95,417.3,0.9174,0.9174,0,0,0,222.1,210.1);
	new cjs.ButtonHelper(this.warm, 0, 1, 1);

	this.text_1 = new cjs.Text(" Wat voor soort goede of slechte dag is het? ", "bold 79px 'Calibri'");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 98;
	this.text_1.lineWidth = 1482;
	this.text_1.parent = this;
	this.text_1.setTransform(985.25,38.55);

	this.uitdaging10 = new lib.Uitdaging10();
	this.uitdaging10.name = "uitdaging10";
	this.uitdaging10.setTransform(1764.05,361.95,1,1,0,0,0,148.3,198.3);
	new cjs.ButtonHelper(this.uitdaging10, 0, 1, 1);

	this.uitdaging9 = new lib.Uitdaging9();
	this.uitdaging9.name = "uitdaging9";
	this.uitdaging9.setTransform(1674.2,768,1,1,0,0,0,156.3,174.3);
	new cjs.ButtonHelper(this.uitdaging9, 0, 1, 1);

	this.uitdaging8 = new lib.Uitdaging8();
	this.uitdaging8.name = "uitdaging8";
	this.uitdaging8.setTransform(1340.05,764,1,1,0,0,0,142.2,170.3);
	new cjs.ButtonHelper(this.uitdaging8, 0, 1, 1);

	this.uitdaging7 = new lib.Uitdaging7();
	this.uitdaging7.name = "uitdaging7";
	this.uitdaging7.setTransform(625.75,774,1,1,0,0,0,146.2,180.3);
	new cjs.ButtonHelper(this.uitdaging7, 0, 1, 1);

	this.uitdaging6 = new lib.Uitdaging6();
	this.uitdaging6.name = "uitdaging6";
	this.uitdaging6.setTransform(301.7,804,1,1,0,0,0,142.2,210.3);
	new cjs.ButtonHelper(this.uitdaging6, 0, 1, 1);

	this.uitdaging5 = new lib.Uitdaging5();
	this.uitdaging5.name = "uitdaging5";
	this.uitdaging5.setTransform(1436,357.95,1,1,0,0,0,144.3,194.3);
	new cjs.ButtonHelper(this.uitdaging5, 0, 1, 1);

	this.uitdaging4 = new lib.Uitdaging4();
	this.uitdaging4.name = "uitdaging4";
	this.uitdaging4.setTransform(1119.85,339.95,1,1,0,0,0,144.2,176.3);
	new cjs.ButtonHelper(this.uitdaging4, 0, 1, 1);

	this.uitdaging3 = new lib.Uitdaging3();
	this.uitdaging3.name = "uitdaging3";
	this.uitdaging3.setTransform(799.8,335.95,1,1,0,0,0,144.2,172.3);
	new cjs.ButtonHelper(this.uitdaging3, 0, 1, 1);

	this.uitdaging2 = new lib.Uitdaging2();
	this.uitdaging2.name = "uitdaging2";
	this.uitdaging2.setTransform(473.75,335.95,1,1,0,0,0,142.2,172.3);
	new cjs.ButtonHelper(this.uitdaging2, 0, 1, 1);

	this.uitdaging1 = new lib.Uitdaging1();
	this.uitdaging1.name = "uitdaging1";
	this.uitdaging1.setTransform(155.5,303.65,1,1,0,0,0,144,140);
	new cjs.ButtonHelper(this.uitdaging1, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text,p:{x:256.05,text:" Hoe stel je je vaak op in discussies? ",lineWidth:1458,y:38.55,font:"bold 94px 'Calibri'",textAlign:"",lineHeight:116.75}}]}).to({state:[{t:this.text,p:{x:244.1,text:" Welk archetype past het beste bij je?",lineWidth:1482,y:38.55,font:"bold 94px 'Calibri'",textAlign:"",lineHeight:116.75}},{t:this.archetype12}]},1).to({state:[{t:this.text,p:{x:244.1,text:" Heb je een goede dag of slechte dag?",lineWidth:1482,y:38.55,font:"bold 94px 'Calibri'",textAlign:"",lineHeight:116.75}}]},1).to({state:[{t:this.text_1,p:{text:" Wat voor soort goede of slechte dag is het? ",y:38.55}},{t:this.warm},{t:this.helder},{t:this.text,p:{x:-926.2,text:"",lineWidth:6,y:442.65,font:"94px 'Calibri-Bold'",textAlign:"center",lineHeight:116.75}},{t:this.stralend},{t:this.vurig}]},1).to({state:[{t:this.text_1,p:{text:"Wat zijn jouw uitdagingen voor de toekomst? Waar wil je aan werken? ",y:38.55}},{t:this.text,p:{x:-926.2,text:"",lineWidth:6,y:442.65,font:"79px 'Calibri-Bold'",textAlign:"center",lineHeight:98.4}},{t:this.uitdaging1},{t:this.uitdaging2},{t:this.uitdaging3},{t:this.uitdaging4},{t:this.uitdaging5},{t:this.uitdaging6},{t:this.uitdaging7},{t:this.uitdaging8},{t:this.uitdaging9},{t:this.uitdaging10}]},1).to({state:[{t:this.text_1,p:{text:"Dat was de test, bedankt voor het invullen van de antwoorden.\n\nIn de uiteindelijke versie zijn hier de antwoorden te zien.",y:220.6}},{t:this.text,p:{x:-929.3,text:"",lineWidth:6,y:442.65,font:"65px 'Calibri-Bold'",textAlign:"",lineHeight:81.35}}]},1).wait(1));

	// btns
	this.archetype11 = new lib.koning();
	this.archetype11.name = "archetype11";
	this.archetype11.setTransform(1480.4,747.15,0.8823,0.8823,0,0,0,111.3,279.4);
	new cjs.ButtonHelper(this.archetype11, 0, 1, 1);

	this.archetype10 = new lib.onbevangenkind();
	this.archetype10.name = "archetype10";
	this.archetype10.setTransform(1172.6,727.2,0.8823,0.8823,0,0,0,122.7,274.8);
	new cjs.ButtonHelper(this.archetype10, 0, 1, 1);

	this.archetype8 = new lib.verzorger();
	this.archetype8.name = "archetype8";
	this.archetype8.setTransform(460.65,725.55,0.8823,0.8823,0,0,0,52.3,115.8);
	new cjs.ButtonHelper(this.archetype8, 0, 1, 1);

	this.archetype9 = new lib.alleman();
	this.archetype9.name = "archetype9";
	this.archetype9.setTransform(806.4,753.25,0.8823,0.8823,0,0,0,111.3,304.3);
	new cjs.ButtonHelper(this.archetype9, 0, 1, 1);

	this.archetype7 = new lib.liefhebber();
	this.archetype7.name = "archetype7";
	this.archetype7.setTransform(233.5,723.3,0.8823,0.8823,0,0,0,113.6,168.2);
	new cjs.ButtonHelper(this.archetype7, 0, 1, 1);

	this.archetype6 = new lib.grapjas();
	this.archetype6.name = "archetype6";
	this.archetype6.setTransform(1775,328.2,0.8823,0.8823,0,0,0,140.8,129.4);
	new cjs.ButtonHelper(this.archetype6, 0, 1, 1);

	this.archetype5 = new lib.vrijbuiter();
	this.archetype5.name = "archetype5";
	this.archetype5.setTransform(1467.55,304.15,0.8823,0.8823,0,0,0,118.2,102.1);
	new cjs.ButtonHelper(this.archetype5, 0, 1, 1);

	this.archetype4 = new lib.ontdekker();
	this.archetype4.name = "archetype4";
	this.archetype4.setTransform(1188.5,325.85,0.8823,0.8823,0,0,0,122.7,154.3);
	new cjs.ButtonHelper(this.archetype4, 0, 1, 1);

	this.archetype3 = new lib.schepper();
	this.archetype3.name = "archetype3";
	this.archetype3.setTransform(820.5,370.7,0.8823,0.8823,0,0,0,145.3,177.1);
	new cjs.ButtonHelper(this.archetype3, 0, 1, 1);

	this.archetype2 = new lib.held();
	this.archetype2.name = "archetype2";
	this.archetype2.setTransform(531.85,379.75,0.8823,0.8823,0,0,0,143.1,161.3);
	new cjs.ButtonHelper(this.archetype2, 0, 1, 1);

	this.archetype1 = new lib.tovenaar();
	this.archetype1.name = "archetype1";
	this.archetype1.setTransform(239.2,369.05,0.8823,0.8823,0,0,0,120.1,203.3);
	new cjs.ButtonHelper(this.archetype1, 0, 1, 1);

	this.slecht = new lib.slecht();
	this.slecht.name = "slecht";
	this.slecht.setTransform(1251.4,564.2,1,1,0,0,0,226.1,172.1);
	new cjs.ButtonHelper(this.slecht, 0, 1, 1);

	this.goed = new lib.goed();
	this.goed.name = "goed";
	this.goed.setTransform(706.25,564.2,1,1,0,0,0,226.1,172.1);
	new cjs.ButtonHelper(this.goed, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.archetype1},{t:this.archetype2},{t:this.archetype3},{t:this.archetype4},{t:this.archetype5},{t:this.archetype6},{t:this.archetype7},{t:this.archetype9},{t:this.archetype8},{t:this.archetype10},{t:this.archetype11}]},1).to({state:[{t:this.goed},{t:this.slecht}]},1).to({state:[]},1).wait(3));

	// volgende
	this.selectarrow_1 = new lib.selecte();
	this.selectarrow_1.name = "selectarrow_1";
	this.selectarrow_1.setTransform(2232.45,827.7,0.7669,0.7669,0,0,0,184.7,294.6);

	this.volgende = new lib.volgende();
	this.volgende.name = "volgende";
	this.volgende.setTransform(983.75,967.35,1,1,0,0,0,190.6,67.5);
	new cjs.ButtonHelper(this.volgende, 0, 1, 1);

	this.volgende1 = new lib.volgende();
	this.volgende1.name = "volgende1";
	this.volgende1.setTransform(983.75,967.35,1,1,0,0,0,190.6,67.5);
	new cjs.ButtonHelper(this.volgende1, 0, 1, 1);

	this.volgende2 = new lib.volgende();
	this.volgende2.name = "volgende2";
	this.volgende2.setTransform(983.75,967.35,1,1,0,0,0,190.6,67.5);
	new cjs.ButtonHelper(this.volgende2, 0, 1, 1);

	this.volgende3 = new lib.volgende();
	this.volgende3.name = "volgende3";
	this.volgende3.setTransform(983.75,967.35,1,1,0,0,0,190.6,67.5);
	new cjs.ButtonHelper(this.volgende3, 0, 1, 1);

	this.volgende4 = new lib.volgende();
	this.volgende4.name = "volgende4";
	this.volgende4.setTransform(983.75,967.35,1,1,0,0,0,190.6,67.5);
	new cjs.ButtonHelper(this.volgende4, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.volgende},{t:this.selectarrow_1}]}).to({state:[{t:this.volgende1}]},1).to({state:[{t:this.volgende2}]},1).to({state:[{t:this.volgende3}]},1).to({state:[{t:this.volgende4}]},1).to({state:[]},1).wait(1));

	// Laag_1
	this.wit = new lib.wittehoed();
	this.wit.name = "wit";
	this.wit.setTransform(1412.1,664.25,0.8575,0.8575,0,0,0,160.1,158.1);
	new cjs.ButtonHelper(this.wit, 0, 1, 1);

	this.blauw = new lib.blauwehoed();
	this.blauw.name = "blauw";
	this.blauw.setTransform(950.6,674.55,0.8575,0.8575,0,0,0,158,170.1);
	new cjs.ButtonHelper(this.blauw, 0, 1, 1);

	this.groen = new lib.groenehoed();
	this.groen.name = "groen";
	this.groen.setTransform(487.15,687,0.8575,0.8575,0,0,0,156.6,184.6);
	new cjs.ButtonHelper(this.groen, 0, 1, 1);

	this.geel = new lib.gelehoed();
	this.geel.name = "geel";
	this.geel.setTransform(1406.95,312.05,0.8575,0.8575,0,0,0,154.1,156.1);
	new cjs.ButtonHelper(this.geel, 0, 1, 1);

	this.rood = new lib.rodehoed();
	this.rood.name = "rood";
	this.rood.setTransform(955.4,332.4,0.8575,0.8575,0,0,0,163.6,179.8);
	new cjs.ButtonHelper(this.rood, 0, 1, 1);

	this.zwart = new lib.zwartehoed();
	this.zwart.name = "zwart";
	this.zwart.setTransform(487.15,338.45,0.8575,0.8575,0,0,0,156.6,186.9);
	new cjs.ButtonHelper(this.zwart, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.zwart},{t:this.rood},{t:this.geel},{t:this.groen},{t:this.blauw},{t:this.wit}]}).to({state:[]},1).wait(5));

	// Laag_2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("EmIRDwsIAAmQImQAAMAAAnbHMMWzAAAIAAGQIGQAAMAAAHbHg");
	this.shape.setTransform(1023.1,621.675);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(6));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-567.5,-378.7,4141.2,2540.7999999999997);
// library properties:
lib.properties = {
	id: '2DE952ADEF3EDC4E9C9B0EF70658E13B',
	width: 1920,
	height: 1080,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/IkBen_atlas_1.png", id:"IkBen_atlas_1"},
		{src:"images/IkBen_atlas_2.png", id:"IkBen_atlas_2"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['2DE952ADEF3EDC4E9C9B0EF70658E13B'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;