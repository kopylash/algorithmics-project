'use strict';

(function() {
  const SCENE = 'game';
  const LOADING_TEXT = 'Loading...';

  let LoadingText,
    ScoreText,
    GameOverText;

  const game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', SCENE);


  /************* Boot ******************/
  const BootGameState = new Phaser.State();

  BootGameState.create = function() {
    LoadingText = game.add.text(game.world.width / 2, game.world.height / 2, LOADING_TEXT, {
      font: '32px "Arial"',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    });
    LoadingText.anchor.setTo(0.5, 0.5);

    game.state.start('Preloader', false, false);
  };


  /************* Preloader ******************/
  const PreloaderGameState = new Phaser.State();

  PreloaderGameState.preload = function() {
    game.load.image('startButton', 'assets/sprites/button-start-game.png');
    game.load.image('sky', 'assets/sprites/sky.png');
    game.load.image('master', 'assets/sprites/master.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');
    game.load.image('booksP', 'assets/sprites/booksP.png');
    game.load.image('booksH', 'assets/sprites/booksH.png');
    game.load.image('booksD', 'assets/sprites/booksD.png');
  };

  PreloaderGameState.create = function() {
    let tween = game.add.tween(LoadingText).to({
      alpha: 0
    }, 1000, Phaser.Easing.Linear.None, true);

    tween.onComplete.add(function() {
      game.state.start('MainMenu', false, false);
    }, this);
  };


  /************* MainMenu ******************/
  const MainMenuGameState = new Phaser.State();

  let StartButton;

  MainMenuGameState.create = function() {
    const onStartBtnClick = () => {
      StartButton.inputEnabled = false;
      game.state.start('GameSwarm', false, false);
    };
    StartButton = game.add.button(game.world.centerX - 100, game.world.centerY - 45, 'startButton', onStartBtnClick, this);
    StartButton.scale.setTo(0.5, 0.5);
  };


  /************* GameSwarm ******************/
  const GameSwarmState = new Phaser.State();

  let player;
  let aliens;
  let cursors;
  let score = 0;
  let books;
  const booksToSpawn = ['D', 'H', 'P'];

  GameSwarmState.create = function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    ScoreText = game.add.text(16, 24, 'Score: 0', {fontSize: '28px', fill: '#000'});

    player = game.add.sprite(32, 200, 'master');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;


    aliens = game.add.group();
    aliens.enableBody = true;

    for (let i = 0; i < 20; i++) {
      let s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
      s.name = 'alien' + s;
      s.body.collideWorldBounds = true;
      s.body.bounce.setTo(0.8, 0.8);
      s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    cursors = game.input.keyboard.createCursorKeys();

    books = game.add.group();
    game.physics.arcade.enable(books);
    books.enableBody = true;

    const spawnBook = () => {
      const name = booksToSpawn.pop();
      let b = game.add.sprite(game.world.randomX, game.world.randomY, `books${name}`);
      books.add(b);
      b.name = name;
      b.body.immovable = true;
      b.body.collideWorldBounds = true;

      let bounceTween = game.add.tween(b);
      bounceTween.to({y: b.y + 5}, 600, Phaser.Easing.Bounce.Out, true, 0, -1, true);
    };

    game.time.events.repeat(Phaser.Timer.SECOND * 10, 3, spawnBook, this);
  };

  GameSwarmState.update = function() {
    const updateScore = () => {
      score += 5;
      ScoreText.text = 'Score: ' + score;
    };
    const gameOverCheck = () => {
      if (!aliens.countLiving()) {
        game.state.start('GameOver', false, false);
      }
    };
    const alienCollisionHandler = (player, alien) => {
      // alien.kill();
      // updateScore();
      // gameOverCheck();
    };
    game.physics.arcade.collide(player, aliens, alienCollisionHandler, null, this);

    const switchMode = () => {

    };
    const booksCollisionHandler = (player, book) => {
      book.kill();
      switchMode();
    };
    game.physics.arcade.collide(player, books, booksCollisionHandler);

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
  };

  /************* GameOver ******************/
  const GameOverState = new Phaser.State();

  GameOverState.create = function() {
    GameOverText = game.add.text(game.world.width / 2, game.world.height / 2, 'YOU ARE JAAK VILO!', {
      font: '32px "Arial"',
      fill: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    });
    GameOverText.anchor.setTo(0.5, 0.5);
  };


  /************* InitWorld ****************/
  game.state.add('Boot', BootGameState, false);
  game.state.add('Preloader', PreloaderGameState, false);
  game.state.add('MainMenu', MainMenuGameState, false);
  game.state.add('GameSwarm', GameSwarmState, false);
  game.state.add('GameOver', GameOverState, false);

  game.state.start('Boot');

})();
