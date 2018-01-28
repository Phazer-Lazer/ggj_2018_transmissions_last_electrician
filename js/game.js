'use strict';

const TILE_HEIGHT = 32;
const TILE_WIDTH = 32;

const PLAYER = PlayerManager;

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

const game = new Phaser.Game(1280, 704, Phaser.AUTO, '', {
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



const isCarried = (name) => {
  return playerInventory.batteries.find(x => x.name === name).carried;
};

const isDelivered = (name) => {
  return playerInventory.batteries.find(x => x.name === name).delivered;
};

// Return true if player is carrying nothing
const isCarryingNothing = () => {
  return playerInventory.batteries.filter((battery) => battery.carried).length ? false : true;
};

const pickupBattery = (player, battery) => {
  // If the player is carrying nothing, allow them to pickup a battery.
  if(isCarryingNothing()){
    console.log(battery);
    battery.kill();
    carryObject(battery.name, true);
  }
};

const interactTerminal = (player, terminal) => {
  // Check if object has been delivered and player is carrying nothing, if so, exit.
  if (isDelivered(terminal.activator) || isCarryingNothing()) {
    return;
  }

  // If player is carrying the activator, deliver it and exit.
  if (isCarried(terminal.activator)) {
    carryObject(terminal.activator, false);
    deliverObject(terminal.activator);
      // Set terminal image to activated
    terminal.loadTexture('terminalOn');
    return;
  }


  // If player is carrying something, but it is not the activator for the terminal, shock them.
  if (!isCarried(terminal.activator)) {
    console.log('shock');
  }

};

const createBattery = (x, y, name) => {
  const battery = batteries.create(x, y, 'battery');
  battery.name = name;
};

// Return true if all batteries are delivered
const isLevelComplete = () => {
  let batteryArray = playerInventory.batteries;
  let batteriesDelivered = 0;
  // if a battery is delivered, att to delivered, then check if all batteries have been delivered to trigger a win condition.

  for(let i = 0; i < batteryArray.length; i++){
    if(batteryArray[i].delivered) batteriesDelivered ++;
  }

  return batteriesDelivered === batteryArray.length;
};

const createTerminal = (x, y, activator) => {
  // Set termianl image based on wether or not it is delivered.

  const terminal = terminals.create(x, y, 'terminalOff');
  terminal.body.immovable = true;
  terminal.activator = activator;
};

function preload() {
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.image('battery', 'assets/battery.png');
  game.load.image('terminalOff', 'assets/terminal_off.png');
  game.load.image('terminalOn', 'assets/terminal_on.png');
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
  player = game.add.sprite(9 * TILE_WIDTH, 16 * TILE_HEIGHT, 'our_hero');
  player.scale.setTo(2, 2);
  game.physics.arcade.enable(player);
  player.animations.add("walk", [0, 1, 2, 3], 10, true);

}

const getDistance = (obj1,obj2) => {
  let a = obj1.x - obj2.x;
  let b = obj1.y - obj2.y;
  return Math.abs(Math.sqrt(a*a + b*b));
};

const isVisible = (position, playerPosition) => {
  let playerDir = player.angle;

  let isHorizontal = (playerDir + 180)%180 === 0;
  let isVertical = !isHorizontal;
  let isInFrontOfPlayer = isHorizontal ?
    Math.sign(position.x - playerPosition.x) === Math.sign(playerDir + 1) :
    Math.sign(position.y - playerPosition.y) === Math.sign(playerDir);

  if (isInFrontOfPlayer) {
    let dx = Math.abs(position.x - playerPosition.x);
    let dy = Math.abs(position.y - playerPosition.y);
    let theta = Math.atan2(dy, dx);
    let degrees = theta * 180/Math.PI;
  
    let inFlashLightView = isHorizontal ?
      degrees < 30 : degrees > 60;
    return inFlashLightView;
  }
  return false;
};

const hideObjects = (player) => {
  let playerPos = player.position;

  // if(calcDistance(batteries.children[0].position, player.position) > 150){
  //   batteries.children[0].visible = false;
  //     } else {
  //       batteries.children[0].visible = true;
  //     }

  paths.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  batteries.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST  && !isCarried(element.name) && !isDelivered(element.name));
  terminals.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  walls.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);

};

function update() {

   hideObjects(player);


  if(isLevelComplete()){
    console.log('Victory!');
  }

  /*
  Add Physics
  */
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(player, batteries, pickupBattery, null, this);
  game.physics.arcade.collide(player, terminals, interactTerminal, null, this);



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
