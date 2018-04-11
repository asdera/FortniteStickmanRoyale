mouse = {
	x: 0,
	y: 0,
	down: false,
	abilty: false
}

function mousePressed() {
	// boxes.push(new Box(Bodies.rectangle(mouseX, mouseY, 40, 40, { restitution: 1 })));
	// boxes.push(new Box(Bodies.circle(mouseX, mouseY, 20, { restitution: 0.4 })));
	mouse.x = mouseX;
	mouse.y = mouseY;
	if (mouseButton == LEFT) {
		mouse.down = true;
		player.mouse(1);
	} else if (mouseButton == RIGHT) {
		mouse.abilty = true;
		player.mouse(2);
	}
}

function mouseReleased() {
	if (mouseButton == LEFT) {
		mouse.down = false;
		if (false) {
			if (Vertices.contains(player.body.vertices, {x: mouse.x, y: mouse.y})) {
			if (player.grounded > 5) { 
				if (sqrt((mouseX - mouse.x) ** 2 + (mouseX - mouse.x) ** 2) < 400) {
					Body.applyForce(player.body, {x: mouse.x, y: mouse.y}, {x: (mouseX - mouse.x) / 2000, y: (mouseY - mouse.y) / 2000});
				} else {
					angle = atan2(mouseY - mouse.y, mouseX - mouse.x);
					Body.applyForce(player.body, {x: mouse.x, y: mouse.y}, {x: Math.cos(angle) / 5, y: Math.sin(angle) / 5});
				}
			}
			} else if (mouseX == mouse.x && mouseY == mouse.y) {
				boxes.push(new Box(Bodies.circle(mouseX, mouseY, 40, { restitution: 1 }), "orange"));
			} else if (abs(mouseX - mouse.x) * abs(mouseY - mouse.y) > 1000){
				boxes.push(new Box(Bodies.rectangle(min(mouseX, mouse.x) + abs(mouseX - mouse.x) / 2, min(mouseY, mouse.y) + abs(mouseY - mouse.y) / 2, abs(mouseX - mouse.x), abs(mouseY - mouse.y), { restitution: 0.4 }), "darkgreen"));
			}
		}
	} else {
		mouse.abilty = false;
		for (var i = structures.length - 1; i >= 0; i--) {
			structurei = structures[i]
			if (Vertices.contains(structurei.body.vertices, {x: mouse.x, y: mouse.y})) {
				if (structurei.id == player.id) {
					structurei.rip();
				}
			}
		}
	}
}

function keyPressed() {
	if (keyCode == 90) {
		mouseButton = LEFT;
		mousePressed();
	}

	if (keyCode == 88) {
		mouseButton = RIGHT;
		mousePressed();
	}

	if (keyCode == 80) {
		// restart level
		clearWorld();
	}
	if (keyCode == 75) {
		createItem(makeItem(getWeapon(1)), mouseX, mouseY)
		// player.inventory.primary = makeItem(randomProperty(weapons));
	}
	if (keyCode == 87 || keyCode == 32) {
		// w or space
		player.controls("jump");
	}
	if (keyCode == 49) {
		// 1
		player.controls("slot1");
	}
	if (keyCode == 50) {
		// 2
		player.controls("slot2");
	}
	if (keyCode == 51) {
		// 3
		player.controls("slot3");
	}
	// if (keyCode == 52) {
	// 	// 4
	// 	player.controls("ability");
	// }
	if (keyCode == 81) {
		// q
		player.controls("wall");
	}
	if (keyCode == 67) {
		// c
		player.controls("floor");
	}
	if (keyCode == 70) {
		// f
		player.controls("stairs");
	}
	if (keyCode == 82) {
		// r
		player.controls("reload");
	}
	if (keyCode == 69) {
		// e
		player.controls("interact");
	}
}

function keyReleased() {
	if (keyCode == 90) {
		mouseButton = LEFT;
		mouseReleased();
	}

	if (keyCode == 88) {
		mouseButton = RIGHT;
		mouseReleased();
	}
}

function keyDowned() {
	if (keyIsDown(65)) {
		// a
		player.controls("left");
	}
	if (keyIsDown(68)) {
		// d
		player.controls("right");
	}
	if (keyIsDown(90)) {
		// shoot pebble
		
	}
}