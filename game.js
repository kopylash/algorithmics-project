'use strict';

(function() {
  const SCENE = 'game';
  const LOADING_TEXT = 'Loading...';

  let LoadingText,
    ScoreText,
    GameOverText,
    BookPickupSound,
    PowerupSound,
    HurtSound,
    CatchupSound;

  const Game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', SCENE);


  /************* Boot ******************/
  const BootGameState = new Phaser.State();

  BootGameState.create = function() {

    LoadingText = Game.add.text(Game.world.width / 2, Game.world.height / 2, LOADING_TEXT, {
      font: '32px "PressStart2P"',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    });
    LoadingText.anchor.setTo(0.5, 0.5);

    Game.state.start('Preloader', false, false);
  };


  /************* Preloader ******************/
  const PreloaderGameState = new Phaser.State();

  PreloaderGameState.preload = function() {
    Game.load.image('startButton', 'assets/sprites/button-start-game.png');
    Game.load.image('sky', 'assets/sprites/sky.png');
    Game.load.image('jaak_young', 'assets/sprites/jaak_young.png');
    Game.load.image('jaak', 'assets/sprites/jaak.png');
    Game.load.image('baddie', 'assets/sprites/space-baddie.png');
    Game.load.image('booksP', 'assets/sprites/booksP.png');
    Game.load.image('booksH', 'assets/sprites/booksH.png');
    Game.load.image('booksD', 'assets/sprites/booksD.png');
    Game.load.image('pixel-heart', 'assets/sprites/pixel-heart.png');
    Game.load.image('block', 'assets/sprites/block.png');
    Game.load.audio('coin', 'assets/sounds/coin.wav');
    Game.load.audio('powerup', 'assets/sounds/powerup.wav');
    Game.load.audio('catchup', 'assets/sounds/catchup.wav');
    Game.load.audio('hurt', 'assets/sounds/hurt.wav');
  };

  PreloaderGameState.create = function() {
    let tween = Game.add.tween(LoadingText).to({
      alpha: 0
    }, 1000, Phaser.Easing.Linear.None, true);

    tween.onComplete.add(function() {
      Game.state.start('MainMenu', false, false);
    }, this);
  };


  /************* MainMenu ******************/
  const MainMenuGameState = new Phaser.State();

  let StartButton;

  MainMenuGameState.create = function() {
    const onStartBtnClick = () => {
      StartButton.inputEnabled = false;
      Game.state.start('Intro', false, false);
    };
    StartButton = Game.add.button(Game.world.centerX - 100, Game.world.centerY - 45, 'startButton', onStartBtnClick, this);
    StartButton.scale.setTo(0.5, 0.5);
  };

  /************* Intro ****************/
  const IntroGameState = new Phaser.State();

  IntroGameState.create = function() {
    let letterIndex = 0;
    let letterDelay = 50;

    let content = "Long time ago, in Finland... \n" +
      "\n" +
      "Horrible disaster happened. \n" +
      "Laziness turned all students into dummy baddies :( \n" +
      "\n" +
      "Jaak, you are the chosen one! \n" +
      "Only you can save them! \n" +
      "\n" +
      "But first you should get your Ph.D. \n" +
      "Collect 3 books with valuable knowledge \n" +
      "And don't let baddies catch you! \n" +
      "They organised lazy swarm \n" +
      "Baddies don't know where are you \n" +
      "But they see the light of knowledge in your heart!\n" +
      "That's why they know how far you are";

    content = content.split('');

    StartButton.kill();

    for (let i = 0; i < Game.world.width; i += 32) {
      Game.add.sprite(i, 0, 'block');
    }
    for (let i = 0; i < Game.world.width; i += 32) {
      Game.add.sprite(i, Game.world.height - 32, 'block');
    }
    for (let i = 32; i < Game.world.height; i += 32) {
      Game.add.sprite(0, i, 'block');
    }
    for (let i = 32; i < Game.world.height; i += 32) {
      Game.add.sprite(Game.world.width - 32, i, 'block');
    }

    let text = Game.add.text(50, 50, '', {
      font: '15px PressStart2P',
      fill: "white",
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.9
    });

    const nextLetter = () => {
      text.text = text.text.concat(content[letterIndex]);
      letterIndex++;

      if (letterIndex === content.length) {
        setTimeout(() => {
          Game.state.start("GameSwarm", false, false)
        }, 4000);
      }

    };

    Game.time.events.repeat(letterDelay, content.length, nextLetter, this);
  };

  /************* GameSwarm ******************/
  const GameSwarmState = new Phaser.State();

  let player;
  let healthBar;
  let swarm;
  let cursors;
  let score = 0;
  let books;
  const booksToSpawn = ['D', 'H', 'P'];

  GameSwarmState.create = function() {
    Game.physics.startSystem(Phaser.Physics.ARCADE);
    Game.add.sprite(0, 0, 'sky');

    ScoreText = Game.add.text(16, 24, 'Score: 0', {font: "25px PressStart2P", fill: '#000'});

    player = Game.add.sprite(32, 200, 'jaak_young');
    Game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5, 0.5);
    player.maxHealth = 100;
    player.health = player.maxHealth;


    swarm = Game.add.group();
    swarm.enableBody = true;
    swarm.gBest = Infinity;
    swarm.gBestX = Infinity;
    swarm.gBestY = Infinity;

    for (let i = 0; i < 30; i++) {
      let s = swarm.create(Game.math.clamp(Game.world.randomX, 200, Game.world.width), Game.world.randomY, 'baddie');
      s.name = 'alien' + s;
      s.body.collideWorldBounds = true;
      s.anchor.set(0.5, 0.5);
      s.body.bounce.setTo(0.8, 0.8);
      s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
      s.pBest = Infinity;
      s.pBestX = s.x;
      s.pBestY = s.y;
    }

    const healthBarConfig = {
      width: 100,
      height: 16,
      x: Game.world.bounds.width - (Game.world.bounds.width / 10),
      y: 30,
      bg: {
        color: 'black'
      },
      bar: {
        color: '#32f210'
      },
      flipped: false
    };

    healthBar = new HealthBar(Game, healthBarConfig);

    cursors = Game.input.keyboard.createCursorKeys();

    books = Game.add.group();
    Game.physics.arcade.enable(books);
    books.enableBody = true;

    const spawnBook = () => {
      const name = booksToSpawn.pop();
      let b = books.create(Game.world.randomX, Game.math.clamp(Game.world.randomY, 100, Game.world.height -200), `books${name}`);
      b.name = name;
      b.body.immovable = true;
      b.body.collideWorldBounds = true;

      let bounceTween = Game.add.tween(b);
      bounceTween.to({y: b.y + 5}, 600, Phaser.Easing.Bounce.Out, true, 0, -1, true);
    };

    Game.time.events.repeat(Phaser.Timer.SECOND * 1, 3, spawnBook, this);

    BookPickupSound = Game.add.audio('coin');
    PowerupSound = Game.add.audio('powerup');
    HurtSound = Game.add.audio('hurt');
    CatchupSound = Game.add.audio('catchup');
  };

  GameSwarmState.update = function() {
    Game.physics.arcade.collide(swarm, swarm);
    Game.physics.arcade.collide(player, swarm, swarmEscapeCollisionHandler);
    Game.physics.arcade.collide(player, books, booksCollisionHandler);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -200;
      resetPSO(this);
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 200;
      resetPSO(this);
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -200;
      resetPSO(this);
    } else if (cursors.down.isDown) {
      player.body.velocity.y = 200;
      resetPSO(this);
    }

    // swarm logic below
    swarm.forEachAlive(child => {
      let fitness = Game.physics.arcade.distanceBetween(child, player);
      if (fitness < child.pBest) {
        child.pBest = fitness;
        child.pBestX = child.x;
        child.pBestY = child.y;
      }
      if (fitness < swarm.gBest) {
        swarm.gBest = fitness;
        swarm.gBestX = child.x;
        swarm.gBestY = child.y;
      }
    }, this);
    swarm.forEachAlive(child => psoMovement(child, swarm.gBestX, swarm.gBestY, 130), this);
  };

  function updateScore(points) {
    score += points;
    ScoreText.text = 'Score: ' + score;
  }

  function swarmEscapeCollisionHandler(player, swarmChild) {
    HurtSound.play();
    player.damage(5);
    swarmChild.kill();
    healthBar.setPercent(player.health);

    if (player.health === 0) {
      Game.state.start('GameOver', false, false);
    }
  }

  function switchMode() {
    if (books.countDead() === 3) {
      PowerupSound.play();
      player.loadTexture('jaak', 0);
      Game.state.start('Interlude', false, false);
    }
  }

  function booksCollisionHandler(player, book) {
    BookPickupSound.play();
    book.kill();
    updateScore(50);
    switchMode();
  }

  function psoMovement(target, gBestX, gBestY, vMax = 50, c1 = 2, c2 = 2) {
    let vx = c1 * Math.random() * (target.pBestX - target.x) + c2 * Math.random() * (gBestX - target.x);
    const newVx = target.body.velocity.x + vx;
    target.body.velocity.x = Math.abs(newVx) <= vMax ? newVx : Math.sign(newVx) * vMax;

    let vy = c1 * Math.random() * (target.pBestY - target.y) + c2 * Math.random() * (gBestY - target.y);
    const newVy = target.body.velocity.y + vy;
    target.body.velocity.y = Math.abs(newVy) <= vMax ? newVy : Math.sign(newVy) * vMax;
  }

  function resetPSO(ctx) {
    swarm.forEachAlive(child => {
      child.pBest = Infinity;
      child.pBestX = child.x;
      child.pBestY = child.y;
    }, ctx);
    swarm.gBest = Infinity;
    swarm.gBestX = Infinity;
    swarm.gBestY = Infinity;
  }

  /************* Interlude ****************/
  const InterludeGameState = new Phaser.State();

  InterludeGameState.create = function() {
    player.body.stop();
    Game.physics.arcade.moveToXY(player, Game.world.width / 2, Game.world.height, 200);

    let letterIndex = 0;
    let letterDelay = 50;

    let content = "Great Job, professor Vilo! \n" +
      "\n" +
      "Now you are powerful enough to teach students \n" +
      "But they are still lazy and don't want to study \n" +
      "So you have to catch'em all :) \n" +
      "\n" +
      "PS: Each caught student will be registered to next Algorithms course";


    content = content.split('');

    let text = Game.add.text(Game.world.width * 0.1, Game.world.height / 4, '', {
      font: '15px PressStart2P',
      fill: "white",
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.8
    });

    const nextLetter = () => {
      text.text = text.text.concat(content[letterIndex]);
      letterIndex++;

      if (letterIndex === content.length) {
        setTimeout(() => {
          Game.state.start("SwarmChasing", false, false);
          text.kill();
        }, 4000);
      }

    };

    Game.time.events.repeat(letterDelay, content.length, nextLetter, this);
  };


  /************* Chasing Mode **************/
  const SwarmChasingGameState = new Phaser.State();

  SwarmChasingGameState.create = function() {
    swarm.forEachAlive(child => child.body.velocity.setTo(Game.math.random(-1, 1) * 400, Game.math.random(-1, 1) * 400), this);
  };

  SwarmChasingGameState.update = function() {
    Game.physics.arcade.collide(swarm, swarm);
    Game.physics.arcade.collide(player, swarm, swarmChasingCollisionHandler);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
      player.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 200;
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -200;
    } else if (cursors.down.isDown) {
      player.body.velocity.y = 200;
    }

    swarm.forEachAlive(child => escapeMovement(child, player), this);
  };

  function gameOverCheck() {
    if (!swarm.countLiving()) {
      Game.state.start('GameOver', false, false);
    }
  }

  function swarmChasingCollisionHandler(player, swarmChild) {
    CatchupSound.play();
    updateScore(5);
    swarmChild.kill();
    gameOverCheck();
  }

  let p1 = new Phaser.Point();
  let p2 = new Phaser.Point();
  let p3 = new Phaser.Point();
  let p4 = new Phaser.Point();
  let p5 = new Phaser.Point();
  let p6 = new Phaser.Point();
  let p7 = new Phaser.Point();
  let p8 = new Phaser.Point();

  function generateNearbyPoints(point) {
    return [
      p1.copyFrom(point).add(-1, -1),
      p2.copyFrom(point).add(0, -1),
      p3.copyFrom(point).add(1, -1),
      p4.copyFrom(point).add(-1, 0),
      p5.copyFrom(point).add(1, 0),
      p6.copyFrom(point).add(-1, 1),
      p7.copyFrom(point).add(0, 1),
      p8.copyFrom(point).add(1, 1)
    ]
  }

  function escapeMovement(swarmChild, player) {
    if (Game.physics.arcade.distanceBetween(player, swarmChild, false, true) < 100) {
      Game.physics.arcade.moveToObject(swarmChild, Game.physics.arcade.farthest(player, generateNearbyPoints(swarmChild)), 350);
    }
  }


  /************* GameOver ******************/
  const GameOverState = new Phaser.State();

  GameOverState.create = function() {
    healthBar.setPercent(0);
    GameOverText = Game.add.text(Game.world.width / 2, Game.world.height / 2, 'YOU ARE JAAK VILO!', {
      font: '32px "PressStart2P"',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    });
    GameOverText.anchor.setTo(0.5, 0.5);
  };

  /************* InitWorld ****************/
  Game.state.add('Boot', BootGameState, false);
  Game.state.add('Preloader', PreloaderGameState, false);
  Game.state.add('MainMenu', MainMenuGameState, false);
  Game.state.add('Intro', IntroGameState, false);
  Game.state.add('Interlude', InterludeGameState, false);
  Game.state.add('GameSwarm', GameSwarmState, false);
  Game.state.add('SwarmChasing', SwarmChasingGameState, false);
  Game.state.add('GameOver', GameOverState, false);

  Game.state.start('Boot');

})();
