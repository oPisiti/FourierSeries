let countTimes = 0;
let startup = 1; 					// Initial number of circles

let waveType = "Square"; 			// Sqr, sawtooth,tri
let waveOptions = [					// Possible wave forms
	"Square",
	"Sawtooth",
	"Triangular"
]
let wave = [];
let wave2 = [];
let waveLength; 					// wave.length
let sizeWave = 1200; 				// Size of the array wave

let deter = solve(waveType, startup);
let reset = startup + 1;
let myCircle = [];
let sinusoidOffset = 300; 			// Offset para sinusoid

let theta  = 0, a,  b;
let theta2 = 0, a2, b2;

let sel;

function setup() {
	createCanvas(windowWidth, windowHeight);

	for (let i = 0; i < deter.r.length; i++) {
		myCircle[i] = new circ(deter.r[i], deter.v[i]);
	}

	// Creating a drop down selector for the wave type
	textAlign(CENTER);
	sel = createSelect();
	sel.style('background-color', 'grey');
	sel.style('border-radius', '5px');
	sel.style('font-size', '20px');
	sel.style('width', '150px');
	sel.style('padding', '0.5em');
	sel.position(10, 10);
	for (const option of waveOptions) {
		sel.option(option);
	}
	sel.selected(waveType);
	sel.changed(mySelectEvent);
}

function draw() {
	background(20);

	let sumY = myCircle[0].pos.y;
	let sumX = myCircle[0].pos.x;

	myCircle[0].update(0);
	myCircle[0].disp(350, 300);

	for (let i = 1; i < myCircle.length; i++) {
		myCircle[i].update();
		myCircle[i].disp(myCircle[i - 1].pos.x, myCircle[i - 1].pos.y);
		sumY += myCircle[i].pos.y;
		sumX += myCircle[i].pos.x;
	}

	for (let i = 1; i < myCircle.length; i++) {
		translate(-myCircle[i - 1].pos.x, -myCircle[i - 1].pos.y);
	}

	stroke(100, 200, 40);

	waveLength = wave.length;
	wave.unshift(sumY);
	wave2.unshift(sumX);

	if (waveLength >= sizeWave) {
		wave.pop();
		wave2.pop();
	}

	for (let i = 2; i < waveLength - 1; i++) {
		curve(
			sinusoidOffset + i - 2,
			wave[i - 2],
			sinusoidOffset + i - 1,
			wave[i - 1],
			sinusoidOffset + i,
			wave[i],
			sinusoidOffset + i + 1,
			wave[i + 1]
		);
		curve(
			wave2[i - 2],
			sinusoidOffset + i - 2,
			wave2[i - 1],
			sinusoidOffset + i - 1,
			wave2[i],
			sinusoidOffset + i,
			wave2[i + 1],
			sinusoidOffset + i + 1
		);
	}
}

function circ(r_, v_) {
	this.r = r_;
	let v = v_;

	let x = this.r;
	let y = 0;
	this.pos = createVector(x, y);

	this.theta = 0;

	this.update = function (qual) {
		this.theta -= v;
		this.pos.x = this.r * cos(this.theta);
		this.pos.y = this.r * sin(this.theta);

		if (qual == 0) {
			countTimes++;
			if (countTimes > 6.28 / deter.v[0]) {
				deter = solve(waveType, reset);
				countTimes = 0;
				reset++;
				for (let i = 0; i < deter.r.length; i++) {
					myCircle[i] = new circ(deter.r[i], deter.v[i]);
				}
			}
		}
	};

	this.disp = function (tx, ty) {
		translate(tx, ty);
		noFill();
		stroke(256);
		strokeWeight(1);
		line(0, 0, this.pos.x, this.pos.y);
		stroke(256, 50);
		circle(0, 0, this.r);
	};
}

// Determines the coefficients
function solve(type, startup) {
	let n = startup;

	let r = [];
	let v = [];

	switch (type) {
		case "Square":
			for (let i = 0; i < n; i++) {
				r[i] = 300 / (3.14 * (2 * i + 1));
				v[i] = 0.035 * (2 * i + 1);
			}
			break;

		case "Sawtooth":
			for (let i = 0; i < n; i++) {
				r[i] = 300 / (3.14 * (i + 1));
				v[i] = 0.010 * (i + 1) * 3.14;
			}
			break;

		case "Triangular":
			for (let i = 0; i < n; i++) {
				r[i] = 150 / (((2 * i + 1) * 3.14) ^ 2);
				v[i] = 0.010 * (2 * i + 1) * 3.14;
			}
			break;
	}

	return {r, v};
}

// How to resize and remove scrollbars
// https://stackoverflow.com/questions/68029286/how-do-i-make-the-canvas-perfectly-fit-to-the-window-size-in-p5
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
  	inputs.center();
  	keyboard.center();
}

// https://p5js.org/reference/#/p5/createSelect
function mySelectEvent() {
  	waveType = sel.value();
	
	// Resetting everything
	countTimes = 0;
	startup = 1; 					// Initial number of circles

	wave = [];
	wave2 = [];
	
	deter = solve(waveType, startup);
	reset = startup + 1;
	myCircle = [];
	for (let i = 0; i < deter.r.length; i++) {
		myCircle[i] = new circ(deter.r[i], deter.v[i]);
	}

	theta  = 0;
	theta2 = 0
}