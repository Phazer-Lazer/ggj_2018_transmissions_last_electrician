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
      'name': 'battery3331',
      'carried': false,
      'delivered': false
    },
  ]
};

let currentLevel = 0;
let player, cursors, spaceBar, batteries, terminals, breakers;
let holes, movables, doors, hazards;
let lightsOn = true;

let actionButton = false;


const game = new Phaser.Game(1280, 704, Phaser.CANVAS, '', {
  preload,
  create,
  update,
  render
});


function preload() {
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.spritesheet('caution', 'assets/caution.png', 32, 32);
  game.load.spritesheet('door', 'assets/moveable_wall.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.spritesheet('battery', 'assets/battery_glow.png', 52, 35);
  game.load.image('terminalOff', 'assets/terminal_off.png');
  game.load.spritesheet('terminalOn', 'assets/terminal_on.png', 64, 96);
  game.load.image('breaker', 'assets/terminal_off.png', 20, 90);
  game.load.image('intro', 'assets/intro_screen.png');
  game.load.spritesheet('electricMan', 'assets/electric_man.png', 42, 48);
  game.load.image('movable', 'assets/wall.png');

  game.load.audio('happy_bgm', 'sounds/happy_bgm.wav');
  game.load.audio('darkness', 'sounds/darkness_bgm.wav');
}

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
  // If the player is carrying nothing, allow them to pickup a battery.
  if(isCarryingNothing()){
    battery.kill();
    carryObject(battery.name, true);
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
  if(actionButton){
    //check if the player has used action button on the breaker, if so turn on hazard
    let  callbacks = breaker.callbackArray;
    for(let i = 0; i < callbacks.length; i++){
      callbacks[i]['function'](callbacks[i].args);
    }
  }
};


const fillHole = (movable, hole) => {
  //check if the movable has collided with the hole. if so, then change hole to floor
  movable.kill();
  hole.kill()

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

const createHazard = (x, y, name, terminal) => {
  const hazard = hazards.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'caution');
  hazard.body.immovable = true;
  hazard.name = name;

  hazard.deactivate = false;
  hazard.terminal = terminal; // Set terminal name that it is associated with for power
  // hazard.callbackArray = callbackArray;
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

const createBreaker = (x, y, callbackArray) => {

  const breaker = breakers.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'breaker');
  breaker.body.immovable = true;
  breaker.callbackArray = callbackArray;
};

const createMovable = (x, y, activator) => {
  const movable = movables.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'movable')
  movable.body.immovable = false;
  movable.activator = activator
}

const createHole = (x, y, activator) => {
  const hole = holes.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'hole')
  hole.body.immovable = true;
  hole.activator = activator
}

function create() {

  game.add.sprite(0, 0, 'intro');

  const electricMan = game.add.sprite(280, 72, 'electricMan');
  electricMan.animations.add('blow', [0, 1], 10, true);
  electricMan.animations.play('blow');

  const happyMusic = game.sound.play('happy_bgm');
  happyMusic.loopFull(1);
}

const getDistance = (obj1,obj2) => {
  let a = obj1.x - obj2.x;
  let b = obj1.y - obj2.y;
  return Math.abs(Math.sqrt(a*a + b*b));
};

const createDoor = (x, y, name) => {
  const door = doors.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'door');
  door.body.immovable = true;
  door.name = name;
};

const interactHazard = (player, hazard) =>  {
  if(!hazard.deactivate){
    // Check if battery is delivered to terminal and therfore on
    let terminalOn = playerInventory.batteries.find(t => t.name === hazard.terminal).delivered;
    if(terminalOn){
      console.log('Shock.');
    }
  }
};

const isVisible = (obj, playerPosition) => {
  // If the object has been killed, alive will be false.  Only check objects that have been not been killed.
  if(obj.alive){
    let playerDir = player.angle;

      let isHorizontal = (playerDir + 180)%180 === 0;
      let isVertical = !isHorizontal;
      let isInFrontOfPlayer = isHorizontal ?
        Math.sign(obj.position.x - playerPosition.x) === Math.sign(playerDir + 1) :
        Math.sign(obj.position.y - playerPosition.y) === Math.sign(playerDir);

      if (isInFrontOfPlayer) {
        let dx = Math.abs(obj.position.x - playerPosition.x);
        let dy = Math.abs(obj.position.y - playerPosition.y);
        let theta = Math.atan2(dy, dx);
        let degrees = theta * 180/Math.PI;

        let inFlashLightView = isHorizontal ?
          degrees < PLAYER.LIGHT_HORIZONTAL : degrees > 90 - PLAYER.LIGHT_VERTICAL;// Light vertical is smalelr the larger it is by default, so invert it this way.
        return inFlashLightView;
      }
      return false;
  }
  return false;
};

const hideObjects = (player) => {
  let playerPos = player.position;

  paths.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  batteries.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST  && !isCarried(element.name) && !isDelivered(element.name));
  terminals.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  walls.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  breakers.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  doors.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  hazards.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  breakers.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
};


function render() {
  if (currentLevel !== 0) {
    player.body.width = 45;
    player.body.height = 45;
    //when facing right
    // player.body.x = player.x - 33;
    // player.body.y = player.y - 20;
    //when facing left
    // player.body.x = player.x - 10;
    // player.body.y = player.y - 20;
    //when facing up
    player.body.x = player.x - 33;
    player.body.y = player.y - 20;


    // if(player.angle = PLAYER.DIR_RIGHT){
    //   player.body.x = player.x - 33;
    //   player.body.y = player.y - 20;
    // } else if(player.angle = PLAYER.DIR_LEFT){
    // player.body.width = 45;
    // player.body.height = 45;
    //   player.body.x = player.x ;
    //   player.body.y = player.y ;
    // }

    // game.debug.body(player);
  }
}

function update() {
  // Initialize cursor to listen to keyboard input
  cursors = game.input.keyboard.createCursorKeys();
  spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  let levelComplete = currentLevel === 0 ? spaceBar.isDown : isLevelComplete();

  if (levelComplete && currentLevel === 0) {
    currentLevel = 1;

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

    movables = game.add.group();
    movables.enableBody = true;

    holes = game.add.group();
    holes.enableBody = true;

    hazards = game.add.group();
    hazards.enableBody = true;

    doors = game.add.group();
    doors.enableBody = true;

    /*
    Create Objects in Groups
    */
    createBattery(7, 16, "battery1");
    // createBattery(200, 300, "battery2");

    createTerminal(21, 16, "battery1");

  createMovable(10, 10);
  createMovable(11, 11);


  const holeX = 12;
  const holeY = 10;
  createHole(12, 10);

    createBreaker(10, 10, [
      {
        'function': EventManager.deactivateHazard,
        'args': {
          'target': "hazard1",
          'targetGroup': hazards // The group of objects that contain the exact hazard
        }
      },
      {
        'function': EventManager.openDoor,
        'args': {
          'target': "door1",
          'targetGroup': doors // The group of objects that contain the exact hazard
        }
      },
      {
        'function': EventManager.openDoor,
        'args': {
          'target': "door2",
          'targetGroup': doors // The group of objects that contain the exact hazard
        }
      },
      {
        'function': EventManager.playSound,
        'args': {
          'game': game,
          'sound': "darkness",
          'loop': false, // The group of objects that contain the exact hazard
          'stopOtherSounds': true
        }
      }
    ]);

    createHazard(8, 8, "hazard1", "battery1");

    createDoor(20, 2, 'door1');
    createDoor(20, 1, 'door2');

    /*
    Create Player
    */
    player = game.add.sprite(5 * TILE_WIDTH, 5 * TILE_HEIGHT, 'our_hero');
    player.scale.setTo(2, 2);
    game.physics.arcade.enable(player);
    player.animations.add("walk", [0, 1, 2, 3], 10, true);

  } else if (levelComplete && currentLevel === 1){
      game.world.removeAll();

      currentLevel += 1;

      // World Manager Level 2 Creating Map
      let currentUpdateFunctionName = `level${currentLevel}Update`;
      WorldManager[currentUpdateFunctionName]();

      batteries = game.add.group();
      batteries.enableBody = true;

      terminals = game.add.group();
      terminals.enableBody = true;

      breakers = game.add.group();
      breakers.enableBody = true;

      playerInventory = {
        batteries: [
          {
            'name': 'battery2',
            'carried': false,
            'delivered': false
          },
          {
            'name': 'battery3',
            'carried': false,
            'delivered': false
          },
          {
            'name': 'battery4',
            'carried': false,
            'delivered': false
          },
          {
            'name': 'battery5',
            'carried': false,
            'delivered': false
          }
        ]
      };
      /*
      Create Objects in Groups Level 2
      */
      createBattery(2, 15, "battery2");
      // createBattery(18, 16, "battery3");
      // createBattery(20, 16, "battery4");
      // createBattery(30, 16, "battery5");

      createTerminal(6, 16, "battery2");


  /*
      Create Player
      */ player= game.add.sprite(5 * TILE_WIDTH, 5 * TILE_HEIGHT, 'our_hero'); player.scale.setTo(2, 2);
  game.physics.arcade.enable( player); player.animations.add("walk", [0, 1, 2, 3], 10, true);
  } else if(isLevelComplete() && currentLevel === 2){
  game.world.removeAll();
  console.log(currentLevel)

      currentLevel += 1
movables.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  holes.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);}

  if (currentLevel !== 0) {

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
    game.physics.arcade.collide(player, movables);
    game.physics.arcade.collide(walls, movables);
    game.physics.arcade.collide(movables, movables);
    game.physics.arcade.collide(player, holes);
    game.physics.arcade.collide(movables, holes, fillHole, null, this);
    game.physics.arcade.collide(player, hazards, interactHazard, null, this);
    game.physics.arcade.collide(player, doors, () => {
    }, null, this);// Callback function is needed, but door doesn't need one, therfore an anonymous function.



    // Disable scroll bar when you use arrow keys, so that when you move with arrow keys the window won't move.
    disableScrollbar();

    // Reset player velocity in each direction so you can't move on angles
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    // Set player anchor to center rotation
    player.anchor.setTo(0.5, 0.5);

    // Initialize cursor to listen to keyboard input
    cursors = game.input.keyboard.createCursorKeys();
    spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    actionButton = spaceBar.isDown;

    if (cursors.left.isDown) {//  Move to the left
      player.body.velocity.x = -PLAYER.SPEED;
      player.angle = PLAYER.DIR_LEFT;
      player.animations.play('walk');
    }
    else if (cursors.right.isDown) {//  Move to the right
      player.body.velocity.x = PLAYER.SPEED;
      player.angle = PLAYER.DIR_RIGHT;
      player.animations.play('walk');
    }
    else if (cursors.up.isDown) {//  Move to the left
      player.body.velocity.y = -PLAYER.SPEED;
      player.angle = PLAYER.DIR_UP;
      player.animations.play('walk');
    }
    else if (cursors.down.isDown) {//  Move to the right
      player.body.velocity.y = PLAYER.SPEED;
      player.angle = PLAYER.DIR_DOWN;
      player.animations.play('walk');
    } else {
      player.animations.stop();
    }
  }
}
