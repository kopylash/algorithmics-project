'use strict';

const getRandomInt = (max) => Math.floor(Math.random() * max);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 3;
    this.color = '#e48';
  }

  distance(point) {
    return Point.distanceTwo(this, point);
  }

  static distanceTwo(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  equals(x, y) {
    return this.x === x && this.y === y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class MovablePoint extends Point {
  constructor(x, y) {
    super(x, y);
    this.vx = Math.random();
    this.vy = Math.random();
    this.pBest = Infinity;
    this.pBestX = x;
    this.pBestY = y;
  }

  psoMovement(c1, c2, vMax) {
    let vx = c1 * Math.random() * (this.pBestX - this.x) + c2 * Math.random() * (gBestX - this.x);
    this.vx = Math.abs(this.vx + vx) <= vMax ? this.vx + vx : Math.sign(this.vx + vx) * vMax;
    let vy = c1 * Math.random() * (this.pBestY - this.y) + c2 * Math.random() * (gBestY - this.y);
    this.vy = Math.abs(this.vy + vy) <= vMax ? this.vy + vy : Math.sign(this.vy + vy) * vMax;

    if ((this.x + this.vx) < 800 && (this.x + this.vx) > 0) {
      this.x += this.vx;
    }
    if ((this.y + this.vy) < 600 && (this.y + this.vy) > 0) {
      this.y += this.vy;
    }
  }

  movementPositions() {
    let coordinates = [-1, 0, 1];
    let res = [];

    for (let i = 0; i < coordinates.length; i++) {
      for (let j = 0; j < coordinates.length; j++) {
        res.push({x: this.x + coordinates[i], y: this.y + coordinates[j]})
      }
    }
    return res.filter((el) => {
      return !(el.x > 800 || el.y > 600 || el.x < 0 || el.y < 0)
    })
  }

  movement(player) {
    this.distance(player) <= 100 ? this.escapeMovement(player, this.movementPositions()) : this.randomMovement();
  }

  escapeMovement(player, positions) {
    let maxDist = 0;
    let index;

    for (let i = 0; i < positions.length; i++) {
      let newDist = Point.distanceTwo(player, new Point(positions[i].x, positions[i].y));
      if (newDist > maxDist) {
        maxDist = newDist;
        index = i;
      }
    }

    if (positions[index] && positions[index]) {
      this.x = positions[index].x;
      this.y = positions[index].y;
    } else {
      console.warn(positions);
    }
  }

  randomMovement() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x > 800 || this.x < 0) {
      this.vx = -this.vx;
    }
    if (this.y > 600 || this.y < 0) {
      this.vy = -this.vy;
    }
  }

  fitness(player) {
    let fitness = this.distance(player);
    if (fitness < this.pBest) {
      this.pBest = fitness;
      this.pBestX = this.x;
      this.pBestY = this.y;
    }
    if (fitness < gBest) {
      gBest = fitness;
      gBestX = this.x;
      gBestY = this.y;
    }
  }
}

class Player extends Point {
  constructor(x, y) {
    super(x, y);
    this.radius = 8;
    this.color = '#5b5';
    this.vx = 1;
    this.vy = 1;
  }

  move(cb) {
    this.x = mouseX;
    this.y = mouseY;
    cb();
  }
}

class World {
  constructor(width = 800, height = 600) {
    // initiate the world
    this.width = width;
    this.height = height;
    this.angryPoints = Array.from({length: 100}, () => new MovablePoint(getRandomInt(width), getRandomInt(height)));
    this.player = new Player(width / 2, height / 2);
    this.mode = 1
  }

  simulate() {
    this.player.move(() => {
      this.angryPoints.forEach(p => {
        p.pBest = Infinity;
        p.pBestX = p.x;
        p.pBestY = p.y;
      });
      gBest = Infinity;
      gBestX = Infinity;
      gBestY = Infinity;
    });
    if (this.mode === 1) {
      this.angryPoints.forEach(p => p.fitness(this.player));
      this.angryPoints.forEach(p => p.psoMovement(2, 2, 3));
    } else if (this.mode === 2) {
      this.angryPoints.forEach(p => p.movement(this.player));
    }
  }

  draw(ctx) {
    this.player.draw(ctx);
    this.angryPoints.forEach(p => p.draw(ctx));
  }
}

const world = new World();
let raf;
let gBest = Infinity;
let gBestX = Infinity;
let gBestY = Infinity;

const canvas = document.getElementById('canvas');
canvas.width = world.width;
canvas.height = world.height;
const ctx = canvas.getContext('2d');

function getPosition(el) {
  let xPosition = 0;
  let yPosition = 0;

  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}

const canvasPos = getPosition(canvas);
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', setMousePosition, false);

canvas.onmousedown = () => {
  world.mode === 1 ? world.mode = 2 : world.mode = 1;
};

function setMousePosition(e) {
  mouseX = e.clientX - canvasPos.x;
  mouseY = e.clientY - canvasPos.y;
}

function draw() {
  // ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.draw(ctx);
  world.simulate();
  raf = window.requestAnimationFrame(draw);
}

draw();
