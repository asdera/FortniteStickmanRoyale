function setPlayer(player, id) {
	playerWidth = 20;
	playerHeight = 50;
	player = new Box(Bodies.rectangle(game.startingPoint.x, game.startingPoint.y-playerHeight/2, playerWidth, playerHeight, { restitution: 0, friction: 0}), "red", 200);
	player.id = id;
	player.width = playerWidth;
	player.height = playerHeight;
	player.jump = 2.5;
	player.speed = 2;
	player.equiped = "slot1";
	player.animation = "running";
	// Facing Right
	player.direction = true;
	player.aim = 1;
	player.stickMan = {
		armL: 0,
		armR: 0,
		handL: 0,
		handR: 0,
		hip: -PI/2,
		legL: 3*PI/4,
		legR: PI/4,
	},
	player.stickPoints = {
		pelvis: {x:0, y:0},
		head: {x:0, y:0},
		heads: {x:0, y:0},
		footL: {x:0, y:0},
		footR: {x:0, y:0},
	}
	player.inventory = {
		building: makeItem("bluePrint"),
		slot1: makeItem("empty"),
		slot2: makeItem("empty"),
		slot3: makeItem("empty"),
	}
	player.resources = {
		ammo: {
			light: 72,
			medium: 60,
			heavy: 36,
			shell: 30,
			rocket: 12,
			magic: Infinity,
			uses: 0,
		},
		mats: {
			wood: 100,
			brick: 100,
			metal: 100,
		}
	}
	// 0:Wall, 1:Floor, 2:Stairs, 3:Trap
	player.building = {
		type: 0,
		material: data.wood,
		stairsEdit: 0
	}
	player.cooldowns = {
		nextJump: 0,
		nextFire: player.inventory[player.equiped].cooldown,
		nextInteract: 0
	},
	player.effects = [];
	player.draw = function() {
		// effects
		eff = this.effects.length
	    while (eff--) {
	      effect = this.effects[eff];
	      effect.time--;
	      if (effect.time <= 0) {
	        effect.effect(this, effect.data);
	        this.effects.splice(eff, 1);
	      }
	    }

	    for (var i in this.cooldowns) {
	    	if (typeof this.cooldowns[i] === "number") {
	    		this.cooldowns[i]--;
	    	} else {
				this.cooldowns[i][0]--;
			}
	    } 

	    pos = this.body.position;
	    vel = this.body.velocity;
	    
		Body.setAngle(this.body, 0)
		Body.setVelocity(this.body, {x: vel.x*0.9, y: vel.y})

		this.stickMan.hip = vel.x/25-PI/2;

		this.stickMan.legL -= abs(vel.x/50);
		this.stickMan.legR += abs(vel.x/50);
		if (this.stickMan.legL < PI/4) {
			this.stickMan.legL += PI/2;
		}
		if (this.stickMan.legR > 3*PI/4) {
			this.stickMan.legR -= PI/2;
		}

	    push();

	    // stroke("white");
	    // noFill(); // fill(this.colour);
	    // strokeWeight(2);
	    // if (pos.y + player.height/2 < 0) {
	    //   triangle(pos.x, 0, pos.x - 20, 20, pos.x + 20, 20);
	    // } else {
	    //   beginShape();
	    //   for (var i in this.body.vertices) {
	    //     vertexi = this.body.vertices[i];
	    //     vertex(vertexi.x, vertexi.y);
	    //   }
	    //   endShape(CLOSE);

	    //   // point(pos.x, pos.y + player.height * 0.6);

	    // }

	    stroke(this.colour);
	    strokeWeight(2);
	    fill("lightblue");
	    this.stickPoints.pelvis = {x: pos.x, y:pos.y+this.height/2-this.width/2};
	    this.stickPoints.head = {x: this.stickPoints.pelvis.x + cos(this.stickMan.hip) * (this.height-this.width), y: this.stickPoints.pelvis.y + sin(this.stickMan.hip) * (this.height-this.width)}
	    this.stickPoints.hands = {x: this.stickPoints.pelvis.x + cos(this.stickMan.hip) * (this.height/2-this.width/2), y: this.stickPoints.pelvis.y + sin(this.stickMan.hip) * (this.height/2-this.width/2)}
	    this.stickPoints.footL = {x: this.stickPoints.pelvis.x + cos(this.stickMan.legL) * sqrt(2) * this.width/2, y: this.stickPoints.pelvis.y + sin(this.stickMan.legL) * sqrt(2) * this.width/2}
	    this.stickPoints.footR = {x: this.stickPoints.pelvis.x + cos(this.stickMan.legR) * sqrt(2) * this.width/2, y: this.stickPoints.pelvis.y + sin(this.stickMan.legR) * sqrt(2) * this.width/2}

	    line(this.stickPoints.head.x, this.stickPoints.head.y, this.stickPoints.pelvis.x, this.stickPoints.pelvis.y)
	    line(this.stickPoints.pelvis.x, this.stickPoints.pelvis.y, this.stickPoints.footL.x, this.stickPoints.footL.y)
	    line(this.stickPoints.pelvis.x, this.stickPoints.pelvis.y, this.stickPoints.footR.x, this.stickPoints.footR.y)
	    ellipse(this.stickPoints.head.x, this.stickPoints.head.y, this.width)


		tempX = floor(pos.x/100)
		tempY = max(floor(pos.y/100), 0)

	    if (this.stairsCheck()) {
	    	stroke("lightblue");
	    	line(pos.x-this.width/2, this.stickPoints.footL.y, pos.x+this.width/2, this.stickPoints.footR.y)
	    }

	    pop();
	    if (!Matter.Bounds.contains(bounds, pos)) {
	      this.rip();
	    }
	    if (this.add) {
	      this.add(pos);
	    }
	}
	player.controls = function(c) {
		pos = this.body.position;
		switch (c) {
			case "left":
				Body.applyForce(this.body, pos, {x: -this.speed/1000, y: 0})
				break;
			case "right":
				Body.applyForce(this.body, pos, {x: this.speed/1000, y: 0})
				break;
			case "jump":
				tempJ = false;
				for (var i = grounds.length - 1; i >= 0; i--) {
					groundi = grounds[i];
					if (Vertices.contains(groundi.body.vertices, {x: pos.x - this.width/4, y: pos.y + this.height * 0.6}) || Vertices.contains(groundi.body.vertices, {x: pos.x + this.width/4, y: pos.y + this.height * 0.6})) {
						tempJ = true;
					}
				}
				tempX = floor(pos.x/100)
			    tempY = floor(pos.y/100)
			    // array1.concat(array2).unique(); 
			    tempA = points[tempX][tempY+1].connections.concat(points[tempX+1][tempY+1].connections).unique();
			    for (var i = tempA.length - 1; i >= 0; i--) {
					structurei = tempA[i];
					if (Vertices.contains(structurei.body.vertices, {x: pos.x - this.width/4, y: pos.y + this.height * 0.6}) || Vertices.contains(structurei.body.vertices, {x: pos.x + this.width/4, y: pos.y + this.height * 0.6})) {
						tempJ = true;
					}
				}
				// for (var i = boxes.length - 1; i >= 0; i--) {
				// 	boxi = boxes[i];
				// 	if (Vertices.contains(boxi.body.vertices, {x: pos.x - this.width/4, y: pos.y + this.height * 0.6}) || Vertices.contains(boxi.body.vertices, {x: pos.x + this.width/4, y: pos.y + this.height * 0.6})) {
				// 		tempJ = true;
				// 	}
				// }		
				if (tempJ && this.cooldowns.nextJump <= 0) {
					Body.setVelocity(this.body, {x: this.body.velocity.x, y: 0})
					Body.applyForce(this.body, pos, {x: 0, y: -this.jump/100});
					this.cooldowns.nextJump = 10;
				}
				break;
			case "slot1":
			case "slot2":
			case "slot3":
				this.equiped = c;
				this.cooldowns.nextFire = this.inventory[this.equiped].cooldown;
				this.cooldowns.nextFire[0] = max(this.cooldowns.nextFire[0], 10)
				break;
			case "wall":
				this.equiped = "building";
				this.building.type = 0;
				break;
			case "floor":
				this.equiped = "building";
				this.building.type = 1;
				break;
			case "stairs":
				this.equiped = "building";
				this.building.type = 2;
				break;
			case "reload":
				if (this.equiped == "building") {
					if (this.building.stairsEdit == 0) {
						this.building.stairsEdit = 1;
					} else if (this.building.stairsEdit == 1) {
						this.building.stairsEdit = 0;
					}
				} else {
					this.reload();
				}
				break;
			case "interact":
				for (var i = boxes.length - 1; i >= 0; i--) {
					boxi = boxes[i]
					if (Vertices.contains(boxi.body.vertices, {x: mouseX, y: mouseY})) {
						if (this.cooldowns.nextInteract <= 0 && getLength(pos, boxi.body.position) < player.height*2) {
							if (boxi.item.resource) {
								boxi.item.supply(this);
								boxi.rip();
							} else if (["slot1", "slot2", "slot3"].includes(this.equiped)) {
								var tempO = boxi.item;
								boxi.item = this.inventory[this.equiped];
								this.inventory[this.equiped] = tempO;
								this.cooldowns.nextInteract = 10;
							}
						}
					}
				}
				break;
			default:
				console.log(c)
		}
		
	}
	// Clicked
	player.mouse = function(c=0) {
		pos = this.body.position;

		this.direction = pos.x > mouseX;

		equipedGun = this.inventory[this.equiped];

	    data.draw(player.stickPoints.hands, atan2(mouseX-player.stickPoints.head.x, mouseY-player.stickPoints.head.y), equipedGun, player.colour);

		switch (this.equiped) {
			case "building":
				if (c == 2) {
					this.building.material = data[this.building.material.next];
				} else {
					strokeWeight(2);
					stroke(255);
					fill("skyblue");
					createStructure(this.building, this.resources.mats, mouse.down, player.id);
				}
				break;
			case "slot1":
			case "slot2":
			case "slot3":
				if (c == 1 && equipedGun.fireType == "semi" && this.cooldowns.nextFire[0] <= 0) {
					if (equipedGun.clip > 0) {
						equipedGun.semiFire(this);
						this.cooldowns.nextFire[0] = equipedGun.fireRate;
						equipedGun.clip--;
					} else {
						console.log("OUT OF AMMO")
						this.reload();
					}
				} else if (mouse.down && equipedGun.fireType == "auto" && this.cooldowns.nextFire[0] <= 0) {
					if (equipedGun.clip > 0) {
						equipedGun.autoFire(this);
						this.cooldowns.nextFire[0] = equipedGun.fireRate;
						equipedGun.clip--;
					} else {
						console.log("OUT OF AMMO")
						this.reload();
					}
				}
			default:
		}
	}
	player.reload = function() {
    	equipedGun = this.inventory[this.equiped];
    	var ammo = min(this.resources.ammo[equipedGun.ammoType], equipedGun.clipSize-equipedGun.clip)
    	equipedGun.clip += ammo;
    	this.resources.ammo[equipedGun.ammoType] -= ammo;
    	this.cooldowns.nextFire[0] = equipedGun.reload;
  	}
	player.action = function(effect, time, data={}) {
    	this.effects.push({effect: effect, time: time, data: data})
  	}
  	player.stairsCheck = function() {
  		pos = this.body.position
  		if (buildingMap[2][tempX][tempY] && (Vertices.contains(buildingMap[2][tempX][tempY].body.vertices, {x: pos.x - this.width/4, y: pos.y + this.height * 0.6}) || Vertices.contains(buildingMap[2][tempX][tempY].body.vertices, {x: pos.x + this.width/4, y: pos.y + this.height * 0.6}))) {
			Body.setVelocity(this.body, {x: this.body.velocity.x, y: buildingMap[2][tempX][tempY].edit ? this.body.velocity.x : -this.body.velocity.x});
			return true;
		} else if (buildingMap[2][tempX][tempY+1] && (Vertices.contains(buildingMap[2][tempX][tempY+1].body.vertices, {x: pos.x - this.width/4, y: pos.y + this.height * 0.6}) || Vertices.contains(buildingMap[2][tempX][tempY+1].body.vertices, {x: pos.x + this.width/4, y: pos.y + this.height * 0.6}))) {
			Body.setVelocity(this.body, {x: this.body.velocity.x, y: buildingMap[2][tempX][tempY+1].edit ? this.body.velocity.x : -this.body.velocity.x});
			return true;
		}
		return false;
  	}
	return player;

}