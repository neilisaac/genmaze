// a hack by neil isaac

var renderer = new THREE.WebGLRenderer({devicePixelRatio: window.devicePixelRatio});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var STEP = 0.016;

var scene = null;
var solution = null;
var target = null;
var camera = null;


function dist(x1, z1, x2, z2) {
	return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(z1-z2, 2));
}


function animate() {
	requestAnimationFrame(animate);

	if (solution == null || target == null && solution.length == 0) {
		console.log("making new scene");

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

		camera.position.set(0, 0, 0);
		camera.rotation.set(0, 0, 0);

		var light = new THREE.PointLight(0xffffff, 1, 100);
		light.position.set(0, 10, 0);
		scene.add(light);

		scene.add(new THREE.AmbientLight(0x202020));

		var maze = createMaze();
		populateMaze(maze, 0, 0);

		printMaze(maze);

		var cubes = createCubes(maze);

		for (var i = 0; i < cubes.length; i++) {
			cubes[i].addToScene(scene);
		}

		solution = solveMaze(maze, 0, 0).reverse();

		for (var i = 0; i < solution.length; i++) {
			console.log(solution[i]);
		}
	}

	if (target != null && dist(camera.position.x, camera.position.z, target[0], target[1]) < 0.02) {
		console.log("reached " + target);
		target = null;
	}

	if (target == null && solution != null && solution.length > 0) {
		target = solution[0];
		solution.splice(0, 1);
		console.log("moving towards " + target);
	}

	if (target != null) {
		var dx = target[0] - camera.position.x;
		var dz = target[1] - camera.position.z;
		var mag = dist(0, 0, dx, dz) + 0.00001;
		camera.position.x += dx * STEP / mag;
		camera.position.z += dz * STEP / mag;

		var x = camera.rotation.x;
		var y = camera.rotation.y;
		var z = camera.rotation.z;

		var d = dist(camera.position.x, camera.position.z, target[0], target[1]);

		camera.position.y = 0;
		camera.lookAt(new THREE.Vector3(target[0], 0, target[1]));

		camera.rotation.y = y + (camera.rotation.y - y) * Math.sin((1-d) / 8);
		camera.position.y = 0.6;
	}

	renderer.render(scene, camera);
}

animate();
