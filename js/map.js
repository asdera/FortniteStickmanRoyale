function setMap() {
	createGround(new Box(Bodies.rectangle(canvaswidth/2, canvasheight, canvaswidth, 40, { isStatic: true }), "black", 999));
	createGround(new Box(Bodies.rectangle(0, canvasheight/2, 40, canvasheight, { isStatic: true }), "black", 999));
	createGround(new Box(Bodies.rectangle(canvaswidth, canvasheight/2, 40, canvasheight, { isStatic: true }), "black", 999));

	createMap(maps[destination]);

	bounds = Matter.Bounds.create([{x: -1000, y: -Infinity}, {x: canvaswidth + 1000, y: canvasheight * 2}])
}

function createMap(map) {
	for (var i = 0; i < map.structures.length; i++) {
		var building = map.structures[i];
		createStructure(building[0], building[1], building[2], data.mats, {x: building[0], y: building[1]});
	}
	for (var i in map.create) {
		for (var j in map.create[i]) {
			create = map.create[i][j];
			if (create[0] == "r") {
				createGround(new Box(Bodies.rectangle(create[1], create[2], create[3]+2, create[4]+2, { isStatic: true }), create[5], create[6]))
			} else if (create[0] == "c") {
				createGround(new Box(Bodies.circle(create[1], create[2], create[3]+2, { isStatic: true }), create[4], create[5]))
			} else if (create[0] == "p") {
				createGround(new Box(Bodies.fromVertices(create[1], create[2], create[3], { isStatic: true }), create[4], create[5]))
			}
		}
	}
	for (var i = 0; i < map.drops.length; i++) {
		createItem(map.drops[i].x, map.drops[i].y, makeItem(getItem(0.8)))
	}
	for (var i = 0; i < map.chests.length; i++) {
		createChest(new Box(Bodies.rectangle(map.chests[i].x, map.chests[i].y, 50, 50), "#E89C1D", 100), 1.2, 1, 2);
	}
}

