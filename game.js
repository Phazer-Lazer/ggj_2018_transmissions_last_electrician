'use strict';

const TILE_HEIGHT = 32;
const TILE_WIDTH = 32;

let playerInventory = {
  battery: false
};

const game = new Phaser.Game(1280, 704, Phaser.AUTO, '', {
  preload,
  create,
  update,
});

let level = 1;
let currentLevel = level;

let player, cursors, batteries;



function preload() {
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.image('dwarf', 'assets/dwarf.png');
}

function create() {

  /*
    Add Groups
  */
  batteries = game.add.group();
  batteries.enableBody = true;

  /*
    Create Objects in Groups
  */
  const battery = batteries.create(200, 500, 'wall');

  /*
    Create Player
  */
  player = game.add.sprite(32, game.world.height - 150, 'our_hero');
  player.animations.add("walk", [0, 1, 2, 3], 10, true);

}

const disableScrollbar = () => {
  window.addEventListener("keydown", function(e) {
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) > -1) {
        e.preventDefault();
    }
  }, false);
};

const pickupBattery = (player, battery) => {
  console.log('Picked up Battery');
  battery.kill();
  playerInventory.battery = true;
  console.log('playerInventory.battery', playerInventory.battery);
  console.log('batter', battery);
};

function update() {
  // Initialize cursor to listen to keyboard input
  cursors = game.input.keyboard.createCursorKeys();





  /*
    Add Physics
  */
  game.physics.arcade.enable(player);
  game.physics.arcade.overlap(player, batteries, pickupBattery, null, this);




  // World Manager Creating Map
  const currentUpdateFunctionName = `level${currentLevel}Update`;
  WorldManager[currentUpdateFunctionName]();

  const PLAYER = PlayerManager;

   // Disable scroll bar when you use arrow keys, so that when you move with arrow keys the window won't move.
   disableScrollbar();

  // Reset player velocity in each direction so you can't move on angles
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  // Set player anchor to center rotation
  player.anchor.setTo(0.5, 0.5);

  if (cursors.left.isDown){//  Move to the left
    player.body.velocity.x = -PLAYER.SPEED;
    player.angle = PLAYER.DIR_LEFT;
    player.animations.play('walk');
  }
  else if (cursors.right.isDown){//  Move to the right
    player.body.velocity.x = PLAYER.SPEED;
    player.angle = PLAYER.DIR_RIGHT;
    player.animations.play('walk');
  }
  else if (cursors.up.isDown){//  Move to the left
    player.body.velocity.y = -PLAYER.SPEED;
    player.angle = PLAYER.DIR_UP;
    player.animations.play('walk');
  }
  else if (cursors.down.isDown){//  Move to the right
    player.body.velocity.y = PLAYER.SPEED;
    player.angle = PLAYER.DIR_DOWN;
    player.animations.play('walk');
  } else {
    player.animations.stop();
  }

}
