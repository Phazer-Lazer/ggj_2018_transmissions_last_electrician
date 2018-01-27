'use strict';

const TILE_HEIGHT = 32;
const TILE_WIDTH = 32;

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', {
  preload,
  create,
  update,
});

let level = 1;
let currentLevel = level;

let player, cursors;



function preload() {
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.image('dwarf', 'assets/dwarf.png');
}

function create() {
  player = game.add.sprite(32, game.world.height - 150, 'dwarf');
}

let disableScrollbar = () => {
  window.addEventListener("keydown", function(e) {
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) > -1) {
        e.preventDefault();
    }
  }, false);
};

function update() {
  game.physics.arcade.enable(player);
  cursors = game.input.keyboard.createCursorKeys();
      
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
  }
  else if (cursors.right.isDown){//  Move to the right
    player.body.velocity.x = PLAYER.SPEED;
    player.angle = PLAYER.DIR_RIGHT;
  }
  else if (cursors.up.isDown){//  Move to the left
    player.body.velocity.y = -PLAYER.SPEED;
    player.angle = PLAYER.DIR_UP;
  }
  else if (cursors.down.isDown){//  Move to the right 
    player.body.velocity.y = PLAYER.SPEED;
    player.angle = PLAYER.DIR_DOWN;
  }
      
}
