var MB;

var scrollSpeed = 0.001;
var iterSpeed = 1;

var cameraX = -0.5;
var cameraY = 0.0;
var cameraScale = 3.5;

var trapX = 0.0;
var trapY = 0.0;
var contrast = 0.02;

var iterationsFactor = 10;

var orbitTrapping = true;
var antialiasing = true;

function preload() {
	MB = loadShader("assets/shader.vert", "assets/shader.frag");
}

function setup() {
    createCanvas(800, 800, WEBGL);
}

function draw() {
	pageSize = select('body').size();
	resizeCanvas(pageSize.width, pageSize.height);

	// trapX = (mouseX/width + cameraX) * cameraScale;
	// trapY = (mouseY/height + cameraY) * cameraScale;

	trapX = sin(millis() / 10000)/2 - 0.5;
	
	background(255, 0, 0);

	MB.setUniform("g1", [0.7, 0.0]);
	MB.setUniform("g2", [0.5, 1.0]);
	MB.setUniform("contrast", 1.0);

	MB.setUniform("iResolution", [width, height]);
	MB.setUniform("scale", cameraScale);
	MB.setUniform("transl", [cameraX, cameraY]);
	MB.setUniform("iterations", 3.5/pow(cameraScale, 0.125) * iterationsFactor);
	MB.setUniform("trap", [trapX, trapY]);

	MB.setUniform("orbitTrapping", orbitTrapping);
	MB.setUniform("antialiasing", antialiasing);

	rect(0, 0, width, height);

	shader(MB);
}

function mouseDragged() {
	cameraX += (pmouseX - mouseX)/width * cameraScale;
	cameraY += (mouseY - pmouseY)/height * cameraScale;
}

function mouseWheel(event) {
	let count = event.delta;

	print(event.delta);

	if(keyCode === SHIFT && keyIsPressed) {
		print("test");
		iterationsFactor -= round(event.delta * iterSpeed);
	} else {
		cameraScale += (count * scrollSpeed) * cameraScale;
	}
}

function keyPressed() {
	if(key === 's') {
		orbitTrapping = !orbitTrapping;
	}
	if(key === 'a') {
		antialiasing = !antialiasing;
	}
}