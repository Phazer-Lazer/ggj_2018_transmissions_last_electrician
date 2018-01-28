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
  ]
};

const game = new Phaser.Game(1280, 704, Phaser.AUTO, '', {
  preload,
  create,
  update,
});

let level = 1;
let currentLevel = level;
<<<<<<< HEAD
let player, cursors, spaceBar, batteries, terminals, doors;
let lightsOn = false;
=======
let player, cursors, spaceBar, batteries, terminals, breakers;
let lightsOn = true;
>>>>>>> b92d855b87addc7ff852346cd742c6b945da9879

let actionButton = false;

const carryObject = (name, value) => {
  let object = playerInventory.batteries.find(b => b.name === name);
  object.carried = value;
};

const deliverObject = (name) => {
  let object = playerInventory.batteries.find(b => b.name === name);
  object.delivered = true;
  console.log(object);
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
  if(actionButton === true){
    // If the player is carrying nothing, allow them to pickup a battery.
    if(isCarryingNothing() ){
      battery.kill();
      carryObject(battery.name, true);
    }
}
};

const interactTerminal = (player, terminal) => {
  if(actionButton === true){
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
      terminal.animations.add('on', [0, 1, 2, 3, 4, 5], 6, true);
      terminal.animations.play('on');

      let newBattery = game.add.sprite(terminal.x + 6, terminal.y + 46, 'battery');
      newBattery.animations.add('glow', [0, 1, 2, 3, 4, 5], 10, true);
      newBattery.animations.play('glow');
      return;
    }


    // If player is carrying something, but it is not the activator for the terminal, shock them.
    if (!isCarried(terminal.activator)) {
      console.log('shock');
    }
  }
};

const interactBreaker = (player, breaker) => {
  //check if the player has used action button on the breaker, if so turn on hazard
}

const createBattery = (x, y, name) => {
  // const battery = batteries.create(x * TILE_WIDTH,  y * TILE_HEIGHT, 'battery');
  // battery.name = name;
  const battery = batteries.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'battery');
  // game.physics.arcade.enable(player);
  battery.animations.add('glow', [0, 1, 2, 3, 4, 5], 10, true);
  battery.animations.play('glow');
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
  // Set terminal image based on wether or not it is delivered.
  // const battery = batteries.create(x * TILE_WIDTH,  y * TILE_HEIGHT, 'battery');
  // battery.name = name;
  const terminal = terminals.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'terminalOff');
  // game.physics.arcade.enable(player);

  terminal.body.immovable = true;
  terminal.activator = activator;
};

const createBreaker = (x, y, activator) => {

  const breaker = breakers.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'breaker');
  breaker.body.immovable = true;
  breaker.activator = activator;
};

function preload() {
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.spritesheet('battery', 'assets/battery_glow.png', 52, 35);
  game.load.image('terminalOff', 'assets/terminal_off.png');
  game.load.spritesheet('terminalOn', 'assets/terminal_on.png', 64, 96);
  // game.load.audio('sword', 'assets/audio/SoundEffects/sword.mp3'); Audio
  game.load.image('breaker', 'assets/terminal_off.png', 20, 90);
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

  breakers = game.add.group();
  breakers.enableBody = true;


  /*
  Create Objects in Groups
  */
  createBattery(7, 16, "battery1");
  // createBattery(200, 300, "battery2");

  createTerminal(21, 16, "battery1");


  /*
  Create Player
  */
  player = game.add.sprite(5 * TILE_WIDTH, 5 * TILE_HEIGHT, 'our_hero');
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
      degrees < 50 : degrees > 40;
    return inFlashLightView;
  }
  return false;
};

const hideObjects = (player) => {
  let playerPos = player.position;

  paths.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  batteries.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST  && !isCarried(element.name) && !isDelivered(element.name));
  terminals.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  walls.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  breakers.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
};

function update() {

  if (!lightsOn) {
    hideObjects(player);
  }


  if(isLevelComplete()){
    console.log('Victory!');
  }

  /*
  Add Physics
  */
  game.physics.arcade.collide(player, walls);
  game.physics.arcade.overlap(player, batteries, pickupBattery, null, this);
  game.physics.arcade.collide(player, terminals, interactTerminal, null, this);
  game.physics.arcade.collide(player, breakers, interactBreaker, null, this);




  // Disable scroll bar when you use arrow keys, so that when you move with arrow keys the window won't move.
  disableScrollbar();

  // Reset player velocity in each direction so you can't move on angles
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  // Set player anchor to center rotation
  player.anchor.setTo(0.5, 0.5);

  // Initialize cursor to listen to keyboard input
  cursors = game.input.keyboard.createCursorKeys();
  spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);;

  if(spaceBar.isDown){
    actionButton = true;
  } else {
    actionButton = false;
  }

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
