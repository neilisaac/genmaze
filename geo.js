// a hack by neil isaac

function stringTexture(text, color) {
	var canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 256, 256);
	ctx.font = "48px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText(text, 50, 50);
	var imgtexture = THREE.ImageUtils.loadTexture(canvas.toDataURL());
	return new THREE.MeshLambertMaterial({map: imgtexture});
}

function getRndColor() {
    var r = 255*Math.random()|0,
        g = 255*Math.random()|0,
        b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function gradientTexture() {
	var canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	var ctx = canvas.getContext("2d");
	var grd = ctx.createRadialGradient(75,50,5,90,60,100);
	grd.addColorStop(0, getRndColor());
	grd.addColorStop(1, getRndColor());
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 256, 256);

	var imgtexture = THREE.ImageUtils.loadTexture(canvas.toDataURL());
	return new THREE.MeshLambertMaterial({map: imgtexture});
}

function stringPlane(text, color) {
	var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), stringTexture(text, color));
	mesh.addToScene = function(scene) {
		scene.add(mesh);
	}
	return mesh;
}

function snazzyPlane() {
	var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), gradientTexture());
	mesh.material.side = THREE.DoubleSide;
	return mesh;
}

function node(x, y, z) {
	this.f = stringPlane(x + " " + z + "\nfront", "#ff0000");
	this.f.rotation.set(0, 0, 0);
	this.f.position.set(x, y, z - 0.5);

	this.l = stringPlane(x + " " + z + "\nleft", "#00ff00");
	this.l.rotation.set(0, Math.PI/2, 0);
	this.l.position.set(x - 0.5, y, z);

	this.b = stringPlane(x + " " + z + "\nback", "#ffff00");
	this.b.rotation.set(0, Math.PI, 0);
	this.b.position.set(x, y, z + 0.5);

	this.r = stringPlane(x + " " + z + "\nright", "#0000ff");
	this.r.rotation.set(0, -Math.PI/2, 0);
	this.r.position.set(x + 0.5, y, z);

	this.addToScene = function(scene) {
		if (this.l) { this.l.addToScene(scene); }
		if (this.r) { this.r.addToScene(scene); }
		if (this.f) { this.f.addToScene(scene); }
		if (this.b) { this.b.addToScene(scene); }
	}
}
