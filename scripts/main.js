var game = new Phaser.Game(800,600,Phaser.CANVAS,'gameDiv');

var spacefield;
var backgroundv;

var player;

var cursors;

var bullets;
var bulletTime = 0;
var fireButton;

var enemies;

var score = 0;
var scoreText;
var winText;

var mainState = {
    preload: function() {
        game.load.image('starfield', 'resources/stars.png');
        game.load.image('player', 'resources/player.png');
        game.load.image('bullet', 'resources/bullet.png');
        game.load.image('enemy', 'resources/enemy.png');
    },

    create: function() {
        spacefield = game.add.tileSprite(0,0,800,600, 'starfield');
        backgroundv = 1;
        player = game.add.sprite(game.world.centerX-50, game.world.centerY+180, 'player');

        game.physics.enable(player, Phaser.Physics.ARCADE);

        cursors = game.input.keyboard.createCursorKeys();

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        enemies = game.add.group();
        enemies.enableBody = true;
        enemies.physicBodyType = Phaser.Physics.ARCADE;

        createEnemies();

        scoreText = game.add.text(0, 550, 'Score:', {font: '32px Arial', fill: '#fff'});
        winText = game.add.text(game.world.centerX-60, game.world.centerY, 'You win !', {font: '32px Arial', fill: '#fff'})
        winText.visible = false;
    },

    update: function() {
        game.physics.arcade.overlap(bullets, enemies, collisionHandler,null, this);
        player.body.velocity.x = 0;

        if(player.position.x < 0) {
            player.position.x = 0;
        }

        if(player.position.x > 700) {
            player.position.x = 700;
        }

        spacefield.tilePosition.y += backgroundv;

        if(cursors.left.isDown) {
            player.body.velocity.x = -350;
        }

        if(cursors.right.isDown) {
            player.body.velocity.x = 350;
        }

        if(fireButton.isDown) {
            fireBullet();
        }

        scoreText.text = 'Score: ' + score;

        if(score == 4000) {
            winText.visible = true;
            scoreText.visible = false;
        }
    }
}

function fireBullet() {
    if(game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);
    }

    if(bullet) {
        bullet.reset(player.x+50, player.y);
        bullet.body.velocity.y = -400;
        bulletTime = game.time.now + 30;
    }
}

function createEnemies() {
    for(var y = 0; y < 4; y++) {
        for(var x = 0; x < 10; x++) {
            var enemy = enemies.create(x*50, y*60, 'enemy');
            enemy.anchor.setTo(0.3, 0.7);
        }
    }

    enemies.x = 100;
    enemies.y = 50;

    var tween = game.add.tween(enemies).to({x: 250}, 2500, Phaser.Easing.Linear.None, true, 0, 1000, true);

    tween.onLoop.add(function() {
        enemies.y += 20;
    }, this);
}

function collisionHandler(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    score += 100;
}

game.state.add('mainState', mainState);
game.state.start('mainState');
