'use strict';

const TILE_HEIGHT = 32;
const TILE_WIDTH = 32;

let playerInventory = {
  batteries: [
  {
    'name': 'battery1',
    'carried': false
  },
  {
    'name': 'battery2',
    'carried': false
  }
]
};

const game = new Phaser.Game(1280, 704, Phaser.AUTO, '', {
  preload,
  create,
  update,
});

let level = 1;
let currentLevel = level;

let player, cursors, batteries, terminals;

const setInventoryItem = (name, value) => {
  let object = playerInventory.batteries.find(b => b.name === name);
  object.carried = value;
};

const disableScrollbar = () => {
  window.addEventListener("keydown", function(e) {
    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].indexOf(e.key) > -1) {
        e.preventDefault();
    }
  }, false);
};

const pickupBattery = (player, battery) => {
  console.log(battery);
  battery.kill();
  setInventoryItem(battery.name, true);
};

const interactTerminal = (player, terminal) => {
  // If player has battery, deliver battery.
  if(playerInventory.batteries.find(x => x.name === terminal.activator).carried){
    setInventoryItem(terminal.activator, false);
    console.log('Delivered');
  }

};

const createBattery = (x, y, name) => {
  const battery = batteries.create(x, y, 'battery');
  battery.name = name;
};

const createTerminal = (x, y, name) => {
  const terminal = terminals.create(x, y, 'terminal');
  terminal.body.immovable = true;
  terminal.activator = name;
};

function preload() {
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.image('battery', 'assets/battery.png');
  game.load.image('terminal', 'assets/terminal.png');
}

function create() {
  // World Manager Creating Map
  const currentUpdateFunctionName = `level${currentLevel}Update`;
  WorldManager[currentUpdateFunctionName]();


  /*
    Add Groups
  */
  batteries = game.add.group();
  batteries.enableBody = true;

  terminals = game.add.group();
  terminals.enableBody = true;


  /*
  Create Objects in Groups
  */
  createBattery(200, 500, "battery1");
  createBattery(200, 300, "battery2");

  createTerminal(150, 500, "battery1");
  createTerminal(150, 350, "battery2");


  /*
  Create Player
  */
  player = game.add.sprite(32, game.world.height - 150, 'our_hero');
  player.scale.setTo(2, 2);
  game.physics.arcade.enable(player);
  player.animations.add("walk", [0, 1, 2, 3], 10, true);

}

function update() {


  /*
  Add Physics
  */
  game.physics.arcade.overlap(player, batteries, pickupBattery, null, this);
  game.physics.arcade.collide(player, terminals, interactTerminal, null, this);

  const PLAYER = PlayerManager;

  // Disable scroll bar when you use arrow keys, so that when you move with arrow keys the window won't move.
  disableScrollbar();

  // Reset player velocity in each direction so you can't move on angles
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  // Set player anchor to center rotation
  player.anchor.setTo(0.5, 0.5);

  // Initialize cursor to listen to keyboard input
  cursors = game.input.keyboard.createCursorKeys();

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
