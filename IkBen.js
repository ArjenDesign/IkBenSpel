(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"IkBen_atlas_1", frames: [[0,0,1855,1362]]},
		{name:"IkBen_atlas_2", frames: [[0,0,1855,1362]]},
		{name:"IkBen_atlas_3", frames: [[0,0,1855,1362]]},
		{name:"IkBen_atlas_4", frames: [[0,0,1855,1362]]},
		{name:"IkBen_atlas_5", frames: [[0,0,1855,1362]]},
		{name:"IkBen_atlas_6", frames: [[0,0,1855,1362]]},
		{name:"IkBen_atlas_7", frames: [[0,0,888,840],[890,0,888,840],[0,842,888,840],[890,842,888,840]]},
		{name:"IkBen_atlas_8", frames: [[906,564,472,452],[906,0,578,562],[0,690,762,270],[0,962,762,270],[0,0,904,688],[1486,0,395,618]]}
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



(lib.CachedBmp_21 = function() {
	this.initialize(ss["IkBen_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["IkBen_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["IkBen_atlas_8"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["IkBen_atlas_8"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["IkBen_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.hat_black = function() {
	this.initialize(ss["IkBen_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.hat_green = function() {
	this.initialize(ss["IkBen_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.hat_red = function() {
	this.initialize(ss["IkBen_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.hat_white = function() {
	this.initialize(ss["IkBen_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.hat_blue = function() {
	this.initialize(ss["IkBen_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.hat_yellow = function() {
	this.initialize(ss["IkBen_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["IkBen_atlas_8"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["IkBen_atlas_8"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["IkBen_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["IkBen_atlas_7"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["IkBen_atlas_7"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(img.CachedBmp_60);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,5061,3041);// helper functions:

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
	this.text = new cjs.Text("Nieuwe dingen\nproberen, moedig en verantwoordelijk\nzijn.", "bold 38px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 48;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(144.05,6.55);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.9,-0.5,320,281);


(lib.Uitdaging9 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Autonoom,\nzichtbaar zijn", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.Uitdaging8 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Betrokken,\nVerbindend,\nHulpvaardig,\nTeamspirit", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.Uitdaging7 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Efficiënt,\nStructuur,\nGeördend", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.Uitdaging6 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Leergierig,\nFlexibel,\nGeduldig", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.Uitdaging5 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Overgave,\nBescheiden,\nBereidwillig", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.Uitdaging4 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Bewust & wakker ten opzichte van anderen", "bold 46px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 58;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(144.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.9,-0.5,320,281);


(lib.Uitdaging3 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Oordeelloos,\nempathisch,\nrespectvol zijn", "bold 46px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 58;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(144.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-15.9,-0.5,320,281);


(lib.Uitdaging2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Bij jezelf blijven,\nReflecteren", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.Uitdaging1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Open, \nToegankelijk, \nEerlijk zijn", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 61;
	this.text.lineWidth = 316;
	this.text.parent = this;
	this.text.setTransform(148.05,22);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-11.9,-0.5,320,281);


(lib.WarmGrasgroen = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Warm\nGras Groen", "bold 94px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 384;
	this.text.parent = this;
	this.text.setTransform(212.1,20.5);

	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,444,484.2);


(lib.VurigOranje = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Vurig\nOranje", "bold 94px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 384;
	this.text.parent = this;
	this.text.setTransform(212.1,20.5);

	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,444,484.2);


(lib.StralendGoudgeel = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Stralend\nGoud\nGeel", "bold 94px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 384;
	this.text.parent = this;
	this.text.setTransform(212.1,20.5);

	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,444,484.2);


(lib.HelderKoningsblauw = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Helder\nKonings\nBlauw", "bold 94px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 384;
	this.text.parent = this;
	this.text.setTransform(212.1,20.5);

	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,444,484.2);


(lib.slecht = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Slecht", "bold 94px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 448;
	this.text.parent = this;
	this.text.setTransform(226.05,102.55);

	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,452.1,344);


(lib.goed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Goed", "bold 94px 'Calibri'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 117;
	this.text.lineWidth = 448;
	this.text.parent = this;
	this.text.setTransform(226.05,102.55);

	this.instance = new lib.CachedBmp_23();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,452.1,344);


(lib.vrijbuiter = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Vrijbuiter/\nProvocateur", "bold 44px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 56;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,231.6);


(lib.verzorger = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Verzorger/\nVoedster", "bold 49px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 62;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.tovenaar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Tovenaar/\nMagiër", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.schepper = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Schepper/\nKunstenaar", "bold 48px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 61;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,231.6);


(lib.ontdekker = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Ontdekker/\nAvonturier", "bold 45px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 57;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,231.6);


(lib.onbevangenkind = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Kind/\nNaïeveling", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.liefhebber = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Liefhebber/\nGeliefde", "bold 45px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 57;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,231.6);


(lib.koning = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Koning/\nKoningin", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.held = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Held/\nStrijder", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.grapjas = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Grapjas/\nNar", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,231.6);


(lib.dewijze = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("De wijze/\nDenker", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.alleman = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("Alleman", "bold 50px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 63;
	this.text.lineWidth = 228;
	this.text.parent = this;
	this.text.setTransform(10,42.45);

	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,240.1,226);


(lib.zwartehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Negatief", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(150.25,102.85);

	this.instance = new lib.hat_black();
	this.instance.setTransform(-142,-47,0.313,0.313);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-142,-47,580.7,426.4);


(lib.wittehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Feitelijk", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 266;
	this.text.parent = this;
	this.text.setTransform(157.25,102.85);

	this.instance = new lib.hat_white();
	this.instance.setTransform(-140,-54,0.3198,0.3198);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-140,-54,593.3,435.6);


(lib.rodehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Op gevoel", "bold 63px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 79;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(150.25,102.85);

	this.instance = new lib.hat_red();
	this.instance.setTransform(-141,-51,0.3156,0.3156);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-141,-51,585.4,429.8);


(lib.groenehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Creatief", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(154.25,102.85);

	this.instance = new lib.hat_green();
	this.instance.setTransform(-141,-47,0.3149,0.3149);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-141,-47,584.2,428.9);


(lib.gelehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Positief", "bold 65px 'Calibri'");
	this.text.textAlign = "center";
	this.text.lineHeight = 81;
	this.text.lineWidth = 264;
	this.text.parent = this;
	this.text.setTransform(150.25,102.85);

	this.instance = new lib.hat_yellow();
	this.instance.setTransform(-145,-55,0.3182,0.3182);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-145,-55,590.2,433.4);


(lib.blauwehoed = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_2
	this.text = new cjs.Text("Beschouwend", "bold 44px 'Calibri'");
	this.text.lineHeight = 56;
	this.text.lineWidth = 270;
	this.text.parent = this;
	this.text.setTransform(30.05,118.85);

	this.instance = new lib.hat_blue();
	this.instance.setTransform(-142,-56,0.3223,0.3223);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-142,-56,597.8,438.9);


(lib.volgende = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.text = new cjs.Text("volgende", "bold 72px 'Calibri'", "#FFFFFF");
	this.text.lineHeight = 90;
	this.text.lineWidth = 284;
	this.text.parent = this;
	this.text.setTransform(22,15.75);

	this.instance = new lib.CachedBmp_2();
	this.instance.setTransform(0,0,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_3();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text,p:{color:"#FFFFFF"}}]}).to({state:[{t:this.instance_1},{t:this.text,p:{color:"#FFFF33"}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,381,135);


(lib.Symbool79 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.CachedBmp_60();
	this.instance.setTransform(962.25,-982.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_60();
	this.instance_1.setTransform(962.25,538.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_60();
	this.instance_2.setTransform(-1568.35,538.15,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_60();
	this.instance_3.setTransform(-1568.35,-982.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1568.3,-982.2,5061.1,3040.8999999999996);


(lib.selecte = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Laag_1
	this.instance = new lib.CachedBmp_1();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.selecte, new cjs.Rectangle(0,0,197.5,309), null);


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
	this.archetype12.setTransform(1500.45,554.4);
	new cjs.ButtonHelper(this.archetype12, 0, 1, 1);

	this.vurig = new lib.VurigOranje();
	this.vurig.name = "vurig";
	this.vurig.setTransform(304,602.7,0.9174,0.9174,0,0,0,218.1,218.2);
	new cjs.ButtonHelper(this.vurig, 0, 1, 1);

	this.stralend = new lib.StralendGoudgeel();
	this.stralend.name = "stralend";
	this.stralend.setTransform(744.4,590.7,0.9174,0.9174,0,0,0,218.1,205.1);
	new cjs.ButtonHelper(this.stralend, 0, 1, 1);

	this.helder = new lib.HelderKoningsblauw();
	this.helder.name = "helder";
	this.helder.setTransform(1196.85,598.7,0.9174,0.9174,0,0,0,231.2,213.8);
	new cjs.ButtonHelper(this.helder, 0, 1, 1);

	this.warm = new lib.WarmGrasgroen();
	this.warm.name = "warm";
	this.warm.setTransform(1628.95,595.3,0.9174,0.9174,0,0,0,222.1,210.1);
	new cjs.ButtonHelper(this.warm, 0, 1, 1);

	this.text_1 = new cjs.Text(" Wat voor soort goede of slechte dag is het? ", "bold 79px 'Calibri'");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 98;
	this.text_1.lineWidth = 1482;
	this.text_1.parent = this;
	this.text_1.setTransform(985.25,38.55);

	this.uitdaging10 = new lib.Uitdaging10();
	this.uitdaging10.name = "uitdaging10";
	this.uitdaging10.setTransform(1455.9,593.7);
	new cjs.ButtonHelper(this.uitdaging10, 0, 1, 1);

	this.uitdaging9 = new lib.Uitdaging9();
	this.uitdaging9.name = "uitdaging9";
	this.uitdaging9.setTransform(1131.85,593.7);
	new cjs.ButtonHelper(this.uitdaging9, 0, 1, 1);

	this.uitdaging8 = new lib.Uitdaging8();
	this.uitdaging8.name = "uitdaging8";
	this.uitdaging8.setTransform(811.8,593.7);
	new cjs.ButtonHelper(this.uitdaging8, 0, 1, 1);

	this.uitdaging7 = new lib.Uitdaging7();
	this.uitdaging7.name = "uitdaging7";
	this.uitdaging7.setTransform(491.75,593.7);
	new cjs.ButtonHelper(this.uitdaging7, 0, 1, 1);

	this.uitdaging6 = new lib.Uitdaging6();
	this.uitdaging6.name = "uitdaging6";
	this.uitdaging6.setTransform(171.7,593.7);
	new cjs.ButtonHelper(this.uitdaging6, 0, 1, 1);

	this.uitdaging5 = new lib.Uitdaging5();
	this.uitdaging5.name = "uitdaging5";
	this.uitdaging5.setTransform(1447.9,289.65);
	new cjs.ButtonHelper(this.uitdaging5, 0, 1, 1);

	this.uitdaging4 = new lib.Uitdaging4();
	this.uitdaging4.name = "uitdaging4";
	this.uitdaging4.setTransform(1131.85,289.65);
	new cjs.ButtonHelper(this.uitdaging4, 0, 1, 1);

	this.uitdaging3 = new lib.Uitdaging3();
	this.uitdaging3.name = "uitdaging3";
	this.uitdaging3.setTransform(811.8,289.65);
	new cjs.ButtonHelper(this.uitdaging3, 0, 1, 1);

	this.uitdaging2 = new lib.Uitdaging2();
	this.uitdaging2.name = "uitdaging2";
	this.uitdaging2.setTransform(491.75,289.65);
	new cjs.ButtonHelper(this.uitdaging2, 0, 1, 1);

	this.uitdaging1 = new lib.Uitdaging1();
	this.uitdaging1.name = "uitdaging1";
	this.uitdaging1.setTransform(315.7,429.65,1,1,0,0,0,144,140);
	new cjs.ButtonHelper(this.uitdaging1, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.text,p:{x:256.05,text:" Hoe stel je je vaak op in discussies? ",lineWidth:1458,y:38.55,font:"bold 94px 'Calibri'",textAlign:"",lineHeight:116.75}}]}).to({state:[{t:this.text,p:{x:244.1,text:" Welk archetype past het beste bij je?",lineWidth:1482,y:38.55,font:"bold 94px 'Calibri'",textAlign:"",lineHeight:116.75}},{t:this.archetype12}]},1).to({state:[{t:this.text,p:{x:244.1,text:" Heb je een goede dag of slechte dag?",lineWidth:1482,y:38.55,font:"bold 94px 'Calibri'",textAlign:"",lineHeight:116.75}}]},1).to({state:[{t:this.text_1,p:{text:" Wat voor soort goede of slechte dag is het? ",y:38.55}},{t:this.warm},{t:this.helder},{t:this.text,p:{x:-926.2,text:"",lineWidth:6,y:442.65,font:"94px 'Calibri-Bold'",textAlign:"center",lineHeight:116.75}},{t:this.stralend},{t:this.vurig}]},1).to({state:[{t:this.text_1,p:{text:"Wat zijn jouw uitdagingen voor de toekomst? Waar wil je aan werken? ",y:38.55}},{t:this.text,p:{x:-926.2,text:"",lineWidth:6,y:442.65,font:"79px 'Calibri-Bold'",textAlign:"center",lineHeight:98.4}},{t:this.uitdaging1},{t:this.uitdaging2},{t:this.uitdaging3},{t:this.uitdaging4},{t:this.uitdaging5},{t:this.uitdaging6},{t:this.uitdaging7},{t:this.uitdaging8},{t:this.uitdaging9},{t:this.uitdaging10}]},1).to({state:[{t:this.text_1,p:{text:"Dat was de test, bedankt voor het invullen van de antwoorden.\n\nIn de uiteindelijke versie zijn hier de antwoorden te zien.",y:32.55}},{t:this.text,p:{x:-929.3,text:"",lineWidth:6,y:442.65,font:"65px 'Calibri-Bold'",textAlign:"",lineHeight:81.35}}]},1).wait(1));

	// btns
	this.archetype11 = new lib.koning();
	this.archetype11.name = "archetype11";
	this.archetype11.setTransform(1248.35,554.4);
	new cjs.ButtonHelper(this.archetype11, 0, 1, 1);

	this.archetype10 = new lib.onbevangenkind();
	this.archetype10.name = "archetype10";
	this.archetype10.setTransform(994.3,554.4);
	new cjs.ButtonHelper(this.archetype10, 0, 1, 1);

	this.archetype8 = new lib.verzorger();
	this.archetype8.name = "archetype8";
	this.archetype8.setTransform(488.2,554.4);
	new cjs.ButtonHelper(this.archetype8, 0, 1, 1);

	this.archetype9 = new lib.alleman();
	this.archetype9.name = "archetype9";
	this.archetype9.setTransform(740.25,554.4);
	new cjs.ButtonHelper(this.archetype9, 0, 1, 1);

	this.archetype7 = new lib.liefhebber();
	this.archetype7.name = "archetype7";
	this.archetype7.setTransform(234.1,554.4);
	new cjs.ButtonHelper(this.archetype7, 0, 1, 1);

	this.archetype6 = new lib.grapjas();
	this.archetype6.name = "archetype6";
	this.archetype6.setTransform(1500.45,310.15);
	new cjs.ButtonHelper(this.archetype6, 0, 1, 1);

	this.archetype5 = new lib.vrijbuiter();
	this.archetype5.name = "archetype5";
	this.archetype5.setTransform(1248.35,310.15);
	new cjs.ButtonHelper(this.archetype5, 0, 1, 1);

	this.archetype4 = new lib.ontdekker();
	this.archetype4.name = "archetype4";
	this.archetype4.setTransform(994.3,310.15);
	new cjs.ButtonHelper(this.archetype4, 0, 1, 1);

	this.archetype3 = new lib.schepper();
	this.archetype3.name = "archetype3";
	this.archetype3.setTransform(740.25,310.15);
	new cjs.ButtonHelper(this.archetype3, 0, 1, 1);

	this.archetype2 = new lib.held();
	this.archetype2.name = "archetype2";
	this.archetype2.setTransform(488.2,310.15);
	new cjs.ButtonHelper(this.archetype2, 0, 1, 1);

	this.archetype1 = new lib.tovenaar();
	this.archetype1.name = "archetype1";
	this.archetype1.setTransform(236.1,309.05,1,1,0,0,0,2,-1.1);
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
	this.wit.setTransform(1489.35,704.25,1,1,0,0,0,160.1,158.1);
	new cjs.ButtonHelper(this.wit, 0, 1, 1);

	this.blauw = new lib.blauwehoed();
	this.blauw.name = "blauw";
	this.blauw.setTransform(951.15,716.25,1,1,0,0,0,158,170.1);
	new cjs.ButtonHelper(this.blauw, 0, 1, 1);

	this.groen = new lib.groenehoed();
	this.groen.name = "groen";
	this.groen.setTransform(412.15,706.25,1,1,0,0,0,158.1,160.1);
	new cjs.ButtonHelper(this.groen, 0, 1, 1);

	this.geel = new lib.gelehoed();
	this.geel.name = "geel";
	this.geel.setTransform(1483.35,354.15,1,1,0,0,0,154.1,156.1);
	new cjs.ButtonHelper(this.geel, 0, 1, 1);

	this.rood = new lib.rodehoed();
	this.rood.name = "rood";
	this.rood.setTransform(949.15,362.15,1,1,0,0,0,156,164.1);
	new cjs.ButtonHelper(this.rood, 0, 1, 1);

	this.zwart = new lib.zwartehoed();
	this.zwart.name = "zwart";
	this.zwart.setTransform(409.15,356.15,1,1,0,0,0,155.1,158.1);
	new cjs.ButtonHelper(this.zwart, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.zwart},{t:this.rood},{t:this.geel},{t:this.groen},{t:this.blauw},{t:this.wit}]}).to({state:[]},1).wait(5));

	// Laag_2
	this.instance = new lib.Symbool79("synched",0);
	this.instance.setTransform(1924.4,1076.5,1,1,0,0,0,1924.4,1076.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(6));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-608.3,-442.2,4101.1,2500.8999999999996);
// library properties:
lib.properties = {
	id: '2DE952ADEF3EDC4E9C9B0EF70658E13B',
	width: 1920,
	height: 1080,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_60.png", id:"CachedBmp_60"},
		{src:"images/IkBen_atlas_1.png", id:"IkBen_atlas_1"},
		{src:"images/IkBen_atlas_2.png", id:"IkBen_atlas_2"},
		{src:"images/IkBen_atlas_3.png", id:"IkBen_atlas_3"},
		{src:"images/IkBen_atlas_4.png", id:"IkBen_atlas_4"},
		{src:"images/IkBen_atlas_5.png", id:"IkBen_atlas_5"},
		{src:"images/IkBen_atlas_6.png", id:"IkBen_atlas_6"},
		{src:"images/IkBen_atlas_7.png", id:"IkBen_atlas_7"},
		{src:"images/IkBen_atlas_8.png", id:"IkBen_atlas_8"}
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