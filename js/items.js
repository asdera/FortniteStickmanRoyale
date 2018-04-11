function createProjectile(box, damage=1, special={}) {
  obj = box;
  obj.type = "bullet";
  obj.hits = 0;
  obj.damage = damage;
  obj.special = special;
  obj.update = function() {
  	pos = this.body.position;
  	if (this.special.lifeSpan && this.life >= this.special.lifeSpan) {
  		if (this.special.endLife) {
        this.special.endLife(this)
      } else {
        this.rip();
      }
  	}
  	tempX = min(max(floor(pos.x/100), 0), 17);
	tempY = min(max(floor(pos.y/100), 0), 8);
	tempA = points[tempX][tempY].connections.concat(points[tempX][tempY+1].connections, points[tempX+1][tempY].connections, points[tempX+1][tempY+1].connections).unique();
    for (var i = 0; i < tempA.length; i++) {
  		colliding = tempA[i];
		if (collideCirclePoly(pos.x, pos.y, this.body.circleRadius*2, colliding.body.vertices)) {
			this.hits++;
			if (this.special.collision) {
				this.special.collision(colliding, this);
			} else {
				// if (colliding.type != "ground") {
				// 	colliding.damage(this.damage);
				// }
				colliding.damage(this.damage);
				this.rip(); 
			}
		}
  	}
  }
  projectiles.push(obj);
  return obj;
}


function makeItem(gun, clip) {
  var obj = Object.assign({}, weapons[gun]);
  if (!gun.resource) {
    obj.clip = typeof clip === "undefined" ? obj.clipSize : clip;
    obj.cooldown = [0];
  }
  return obj;
}

function getItem(score) {
  var dice = random();
  if (dice < 0.5) {
    return getWeapon(score);
  } else {
    return random(data.resources);
  }
}

function getWeapon(score) {
  var a = score;
  var b = 0.8;
  var dice = random();
  if (dice < -(a*(b**4-b**5))/(a*b**5-1)) {
    return random(data.legendaryWeapons)
  } else if (dice < -(a*(b**3-b**5))/(a*b**5-1)) {
    return random(data.epicWeapons)
  } else if (dice < -(a*(b**2-b**5))/(a*b**5-1)) {
    return random(data.rareWeapons)
  } else if (dice < -(a*(b-b**5))/(a*b**5-1)) {
    return random(data.uncommonWeapons)
  } else {
    return random(data.commonWeapons)
  }
}

function hitScan() {
	
}