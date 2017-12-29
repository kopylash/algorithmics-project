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

  move() {
    let vx = 2 * Math.random() * (this.pBestX - this.x) + 2 * Math.random() * (gBestX - this.x);
    vx = Math.abs(this.vx + vx) <= 3 ? this.vx + vx : Math.sign(this.vx + vx) * 3;
    this.vx = vx;
    let vy = 2 * Math.random() * (this.pBestY - this.y) + 2 * Math.random() * (gBestY - this.y);
    vy = Math.abs(this.vy + vy) <= 3 ? this.vy + vy : Math.sign(this.vy + vy) * 3;
    this.vy = vy;

    this.x += this.vx;
    this.y += this.vy;
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
    this.angryPoints.forEach(p => p.fitness(this.player));
    this.angryPoints.forEach(p => p.move());
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
