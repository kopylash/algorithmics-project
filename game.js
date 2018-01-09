'use strict';

(function() {
  const SCENE = 'game';
  const LOADING_TEXT = 'Loading...';

  let LoadingText,
    ScoreText,
    GameEndText,
    BookPickupSound,
    PowerupSound,
    HurtSound,
    CatchupSound,
    GameOverSound,
    GameWinSound,
    ScoreSound,
    GamePad,
    GameStick;

  const TEXT_SCALE_FACTOR = window.devicePixelRatio <= 1 ? 2 : window.devicePixelRatio;
  const VELOCITY_SCALE_FACTOR = window.devicePixelRatio >= 3 ? 2 : 1;

  const scaleAsset = (asset, defaultWidth = 720, defaultHeight = 1280) => {
    if (window.devicePixelRatio > 1) {
      asset.scale.setTo(window.innerWidth * window.devicePixelRatio / defaultWidth, window.innerHeight * window.devicePixelRatio / defaultHeight);
    }
  };

  const Game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'phaser-example', SCENE);

  /************* Boot ******************/
  const BootGameState = new Phaser.State();

  BootGameState.create = function() {
    Game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    LoadingText = Game.add.text(Game.world.width / 2, Game.world.height / 2, LOADING_TEXT, {
      font: `${TEXT_SCALE_FACTOR * 2}em "PressStart2P"`,
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
    Game.load.image('startButton', 'assets/sprites/btn-start.png');
    Game.load.image('aboutButton', 'assets/sprites/btn-about.png');
    Game.load.image('backButton', 'assets/sprites/btn-back.png');
    Game.load.image('block', 'assets/sprites/block.png');
    Game.load.atlas('gamepad', 'assets/sprites/arcade-joystick.png', 'assets/sprites/arcade-joystick.json');
    Game.load.image('sky', 'assets/sprites/sky.png');
    Game.load.image('jaak_young', 'assets/sprites/jaak_young.png');
    Game.load.image('baddie', 'assets/sprites/space-baddie.png');
    Game.load.image('pixel-heart', 'assets/sprites/pixel-heart.png');
    Game.load.image('booksP', 'assets/sprites/booksP.png');
    Game.load.image('booksH', 'assets/sprites/booksH.png');
    Game.load.image('booksD', 'assets/sprites/booksD.png');
    Game.load.image('jaak', 'assets/sprites/jaak.png');
    Game.load.image('retryButton', 'assets/sprites/btn-retry-black.png');
    Game.load.image('logo', 'assets/sprites/logo.png');
    Game.load.image('utLogo', 'assets/sprites/ut-logo.png');
    Game.load.image('githubLogo', 'assets/sprites/github-logo.png');

    Game.load.audio('hurt', 'assets/sounds/hurt.wav');
    Game.load.audio('coin', 'assets/sounds/coin.wav');
    Game.load.audio('powerup', 'assets/sounds/powerup.wav');
    Game.load.audio('catchup', 'assets/sounds/catchup.wav');
    Game.load.audio('gameover', 'assets/sounds/gameover.wav');
    Game.load.audio('score', 'assets/sounds/score.wav');
    Game.load.audio('victory', 'assets/sounds/victory.mp3');
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
  let AboutButton;
  let logo;

  MainMenuGameState.create = function() {
    logo = Game.add.sprite(Game.world.centerX, 50, 'logo');
    logo.anchor.setTo(0.5, 0);
    scaleAsset(logo);

    const onStartBtnClick = () => {
      Game.state.start('GameSwarm', true, false);
    };
    const onAboutBtnClick = () => {
      Game.state.start('About', true, false);
    };

    StartButton = Game.add.button(Game.world.centerX, Game.world.centerY, 'startButton', onStartBtnClick, this);
    StartButton.anchor.setTo(0.5);
    AboutButton = Game.add.button(StartButton.x, StartButton.y + StartButton.height + 10, 'aboutButton', onAboutBtnClick, this);
    AboutButton.anchor.setTo(0.5);
  };

  /************* About ****************/
  const AboutGameState = new Phaser.State();

  let BackButton;
  let UTLogo;
  let GithubLogo;

  AboutGameState.create = function() {
    const onBackButtonClick = () => {
      Game.state.start('MainMenu', true, false);
    };

    const onGithubLogoClick = () => {
      window.open('https://github.com/kopylash/algorithmics-project', '_blank');
    };

    UTLogo = Game.add.sprite(Game.world.width, Game.world.height, 'utLogo');
    UTLogo.anchor.setTo(1, 1);
    scaleAsset(UTLogo);

    GithubLogo = Game.add.button(0, Game.world.height, 'githubLogo', onGithubLogoClick, this);
    GithubLogo.anchor.setTo(0, 1);
    scaleAsset(GithubLogo);

    let title = Game.add.text(Game.world.centerX, 50, 'MTAT.03.238 Advanced Algorithmics project', {
      font: `${TEXT_SCALE_FACTOR * 1.15}em PressStart2P`,
      fill: "white",
      align: 'center',
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.85
    });

    title.anchor.setTo(0.5, 0.5);

    const content = '\nThis is the last project in our master studies. ' +
      'We used our chance to make something awesome. ' +
      'While choosing topic we decided to make a game ' +
      'about our biggest professor - Jaak Vilo. ' +
      'Credits to him! Thanks for really cool ' +
      'lectures and sorry that we did`t attend any of them :) ' +
      '\n' +
      '\n' +
      'Big thanks to our TA Dima Fishman for candies and being Dima Fishman! ' +
      '\n' +
      '\n' +
      'With love, creators: Vladyslav Kopylash, Artem Zaitsev, Volodymyr Leno. \n' +
      '\n' +
      'PS: Professor, we hope you have a good sense of humor and we won`t be exmatriculated tomorrow! ' +
      '\n' +
      '\n' +
      'Fall 2017';

    let text = Game.add.text(Game.world.width / 10, title.y + 50, content, {
      font: `${TEXT_SCALE_FACTOR}em PressStart2P`,
      fill: "white",
      align: 'left',
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.85
    });

    text.lineSpacing = 3;

    BackButton = Game.add.button(Game.world.centerX, text.height + 100, 'backButton', onBackButtonClick, this);
    BackButton.scale.setTo(TEXT_SCALE_FACTOR * 0.35);
    BackButton.anchor.setTo(0.5, 0);
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
      "Collect 3 books with valuable knowledge. \n" +
      "And don't let the baddies to catch you! \n" +
      "\n" +
      "They organized a lazy swarm. \n" +
      "Baddies don't know where are you. \n" +
      "But they see the light of knowledge in your heart!\n" +
      "That's why they know how far you are.";

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
      font: `${TEXT_SCALE_FACTOR}em PressStart2P`,
      fill: "white",
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.85
    });

    text.lineSpacing = 5;

    const nextLetter = () => {
      text.text = text.text.concat(content[letterIndex]);
      letterIndex++;

      if (letterIndex === content.length) {
        setTimeout(() => {
          Game.state.start("GameSwarm", false, false)
        }, 2000);
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
  let booksToSpawn = ['D', 'H', 'P'];

  GameSwarmState.create = function() {
    Game.physics.startSystem(Phaser.Physics.ARCADE);
    let sky = Game.add.sprite(0, 0, 'sky');
    sky.scale.setTo(Game.world.width / 800, Game.world.height / 600);

    GamePad = Game.plugins.add(Phaser.VirtualJoystick);
    GameStick = GamePad.addStick(0, 0, 100, 'gamepad');
    GameStick.showOnTouch = true;

    ScoreText = Game.add.text(16, 24, 'Score: 0', {font: "25px PressStart2P", fill: '#000'});

    player = Game.add.sprite(32, 200, 'jaak_young');
    Game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5, 0.5);
    scaleAsset(player);
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
      scaleAsset(s);
      s.body.bounce.setTo(0.8, 0.8);
      s.body.velocity.setTo(10 + Math.random() * 40 * VELOCITY_SCALE_FACTOR, 10 + Math.random() * 40 * VELOCITY_SCALE_FACTOR);
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
      let b = books.create(Game.world.randomX, Game.math.clamp(Game.world.randomY, 100, Game.world.height - 200), `books${name}`);
      scaleAsset(b);
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

    if (GameStick.isDown) {
      Game.physics.arcade.velocityFromRotation(GameStick.rotation, GameStick.force * 420 * VELOCITY_SCALE_FACTOR, player.body.velocity);
      resetPSO(this);
    } else {
      player.body.velocity.set(0);
    }

    if (cursors.left.isDown) {
      player.body.velocity.x = -300 * VELOCITY_SCALE_FACTOR;
      resetPSO(this);
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 300 * VELOCITY_SCALE_FACTOR;
      resetPSO(this);
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -300 * VELOCITY_SCALE_FACTOR;
      resetPSO(this);
    } else if (cursors.down.isDown) {
      player.body.velocity.y = 300 * VELOCITY_SCALE_FACTOR;
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
    swarm.forEachAlive(child => psoMovement(child, swarm.gBestX, swarm.gBestY, 250 * VELOCITY_SCALE_FACTOR), this);
  };

  function updateScore(points) {
    score += points;
    ScoreText.text = 'Score: ' + score;
  }

  function swarmEscapeCollisionHandler(player, swarmChild) {
    HurtSound.play();

    let tween = Game.add.tween(player).to({alpha: 0.5}, 60, Phaser.Easing.Linear.None, true);
    tween.onComplete.add(() => player.alpha = 1, this);

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

  GameSwarmState.shutdown = function() {
    GamePad.removeStick(GameStick);
  };

  /************* Interlude ****************/
  const InterludeGameState = new Phaser.State();

  InterludeGameState.create = function() {
    player.body.stop();
    Game.physics.arcade.moveToXY(player, Game.world.width / 2, Game.world.height, 200 * VELOCITY_SCALE_FACTOR);

    let letterIndex = 0;
    let letterDelay = 50;

    let content = "Great Job, professor Vilo! \n" +
      "\n" +
      "Now you are powerful enough to teach students. \n" +
      "But they are still lazy and don't want to study. \n" +
      "So you have to catch'em all :) \n" +
      "\n" +
      "PS: Each caught student will be registered to next Algorithms course.";


    content = content.split('');

    let text = Game.add.text(Game.world.width * 0.1, Game.world.height / 4, '', {
      font: `${TEXT_SCALE_FACTOR}em PressStart2P`,
      fill: "white",
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.85
    });

    text.lineSpacing = 5;

    const nextLetter = () => {
      text.text = text.text.concat(content[letterIndex]);
      letterIndex++;

      if (letterIndex === content.length) {
        setTimeout(() => {
          Game.state.start("SwarmChasing", false, false);
          text.kill();
        }, 3000);
      }

    };

    Game.time.events.repeat(letterDelay, content.length, nextLetter, this);
  };


  /************* Chasing Mode **************/
  const SwarmChasingGameState = new Phaser.State();

  SwarmChasingGameState.create = function() {
    swarm.forEachAlive(child => child.body.velocity.setTo(Game.math.random(-1, 1) * 370, Game.math.random(-1, 1) * 350 * VELOCITY_SCALE_FACTOR), this);

    GameStick = GamePad.addStick(0, 0, 100, 'gamepad');
    GameStick.showOnTouch = true;
  };

  SwarmChasingGameState.update = function() {
    Game.physics.arcade.collide(swarm, swarm);
    Game.physics.arcade.collide(player, swarm, swarmChasingCollisionHandler);

    if (GameStick.isDown) {
      Game.physics.arcade.velocityFromRotation(GameStick.rotation, GameStick.force * 550 * VELOCITY_SCALE_FACTOR, player.body.velocity);
      resetPSO(this);
    } else {
      player.body.velocity.set(0);
    }

    if (cursors.left.isDown) {
      player.body.velocity.x = -350 * VELOCITY_SCALE_FACTOR;
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 350 * VELOCITY_SCALE_FACTOR;
    }

    if (cursors.up.isDown) {
      player.body.velocity.y = -350 * VELOCITY_SCALE_FACTOR;
    } else if (cursors.down.isDown) {
      player.body.velocity.y = 350 * VELOCITY_SCALE_FACTOR;
    }

    swarm.forEachAlive(child => escapeMovement(child, player), this);
  };

  function gameWinCheck() {
    if (!swarm.countLiving()) {
      Game.state.start('GameWin', false, false);
    }
  }

  function swarmChasingCollisionHandler(player, swarmChild) {
    CatchupSound.play();
    updateScore(5);
    swarmChild.kill();
    gameWinCheck();
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
    if (Game.physics.arcade.distanceBetween(player, swarmChild, false, true) < 150) {
      Game.physics.arcade.moveToObject(swarmChild, Game.physics.arcade.farthest(player, generateNearbyPoints(swarmChild)), 400 * VELOCITY_SCALE_FACTOR);
    }
  }

  SwarmChasingGameState.shutdown = function() {
    GamePad.removeStick(GameStick);
  };


  /************* GameOver ******************/
  const GameOverState = new Phaser.State();

  let RetryButton;

  function convertScoreToText(score) {
    if (score >= 360) {
      return 'Mr. Vilo, is this you?';
    }

    if (score > 320) {
      return `Wow, that's Ph.D. level!`;
    }

    if (score > 280) {
      return 'You are Master student.';
    }

    return 'Still Bachelor, train more.'
  }

  function onRetryBtnClick() {
    booksToSpawn = ['D', 'H', 'P'];
    score = 0;
    Game.state.start('GameSwarm', true, false);
  }

  GameOverState.create = function() {
    GameOverSound = Game.add.audio('gameover');
    GameOverSound.play();

    healthBar.setPercent(0);

    GameEndText = Game.add.text(Game.world.centerX, Game.world.height * 0.45, `Game Over\n\n${convertScoreToText(score)}`, {
      font: `${TEXT_SCALE_FACTOR * 2}em "PressStart2P"`,
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.85
    });
    GameEndText.anchor.setTo(0.5, 0.5);

    RetryButton = Game.add.button(Game.world.centerX, Game.world.height * 0.7, 'retryButton', onRetryBtnClick, this);
    RetryButton.anchor.setTo(0.5);
  };

  /************* GameWin ******************/
  const GameWinState = new Phaser.State();

  GameWinState.create = function() {
    ScoreSound = Game.add.audio('score');
    GameWinSound = Game.add.audio('victory');
    GameWinSound.play();

    const convertHealthToPoints = () => {
      healthBar.setPercent(0);
      ScoreSound.play();
      updateScore(player.health);
    };
    convertHealthToPoints();

    GameEndText = Game.add.text(Game.world.centerX, Game.world.height * 0.45, `Congrats!\n${convertScoreToText(score)}`, {
      font: `${TEXT_SCALE_FACTOR * 2}em "PressStart2P"`,
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: Game.world.width * 0.85
    });
    GameEndText.anchor.setTo(0.5, 0.5);

    RetryButton = Game.add.button(Game.world.centerX, Game.world.height * 0.7, 'retryButton', onRetryBtnClick, this);
    RetryButton.anchor.setTo(0.5);
  };

  GameWinState.shutdown = function() {
    GameWinSound.stop();
  };


  /************* InitWorld ****************/
  Game.state.add('Boot', BootGameState, false);
  Game.state.add('Preloader', PreloaderGameState, false);
  Game.state.add('MainMenu', MainMenuGameState, false);
  Game.state.add('About', AboutGameState, false);
  Game.state.add('Intro', IntroGameState, false);
  Game.state.add('Interlude', InterludeGameState, false);
  Game.state.add('GameSwarm', GameSwarmState, false);
  Game.state.add('SwarmChasing', SwarmChasingGameState, false);
  Game.state.add('GameOver', GameOverState, false);
  Game.state.add('GameWin', GameWinState, false);

  Game.state.start('Boot');

})();
