'use strict';

const TILE_HEIGHT = 32;
const TILE_WIDTH = 32;

let playerInventory = {
  batteries: [
  {
    'name': 'battery1',
    'carried': false,
    'delivered': false
  },
  {
    'name': 'battery2',
    'carried': false,
    'delivered': false
  }
]
};

const game = new Phaser.Game(1280, 720, Phaser.AUTO, '', {
  preload,
  create,
  update,
});

let level = 1;
let currentLevel = level;

let player, cursors, batteries, terminals;

const carryObject = (name, value) => {
  let object = playerInventory.batteries.find(b => b.name === name);
  object.carried = value;
};

const deliverObject = (name) => {
  let object = playerInventory.batteries.find(b => b.name === name);
  object.delivered = true;
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
  carryObject(battery.name, true);
};

const isCarried = (name) => {
  return playerInventory.batteries.find(x => x.name === name).carried;
};

const interactTerminal = (player, terminal) => {
  // If player has battery, deliver battery.
  if(isCarried(terminal.activator)){
    carryObject(terminal.activator, false);
    deliverObject(terminal.activator);

    // Set termainl image to activated
    terminal.loadTexture('wall');
  }
  
};

const createBattery = (x, y, name) => {
  const battery = batteries.create(x, y, 'wall');
  battery.name = name;
};

const createTerminal = (x, y, activator) => {
  // Set termianl image based on wether or not it is delivered.

  const terminal = terminals.create(x, y, 'path');
  terminal.body.immovable = true;
  terminal.activator = activator;
};    

function preload() {
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  
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
  game.physics.arcade.enable(player);
  player.animations.add("walk", [0, 1, 2, 3], 10, true);
  
}

function update() {
  
  
  /*
  Add Physics
  */
  game.physics.arcade.overlap(player, batteries, pickupBattery, null, this);
  game.physics.arcade.collide(player, terminals, interactTerminal, null, this);
  
  
  
  
  // // World Manager Creating Map
  // const currentUpdateFunctionName = `level${currentLevel}Update`;
  // WorldManager[currentUpdateFunctionName]();
  
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
