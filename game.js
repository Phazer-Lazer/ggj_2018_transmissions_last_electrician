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

let exitHit = false;
let levelComplete = false;
let playerDead = false;
let deathInterval;
let levelLoading = false;
let dialogueText;
let currentLevel = 0;
let player, cursors, spaceBar, batteries, terminals, breakers;
let batteryIcons, exits;
let shocked;

let holes, movables, doors, hazards, batteryUi, graphics, batteryFill;
let lightsOn = true;

let flashlightFlicker = false;
let actionButton = false;


const game = new Phaser.Game(1280, 704, Phaser.CANVAS, '', {
  preload,
  create,
  update,
  render
});

function preload() {
  game.load.image('exit', 'assets/exit.png');
  game.load.spritesheet('live_wire', 'assets/live_wire.png', 64, 32);
  game.load.spritesheet('our_hero', 'assets/our_32x32_hero.png', 32, 32);
  game.load.spritesheet('caution', 'assets/caution.png', 32, 32);
  game.load.spritesheet('door', 'assets/moveable_wall.png', 32, 32);
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
  game.load.image('floor', 'assets/floor.png');
  game.load.spritesheet('battery', 'assets/battery_glow.png', 52, 35);
  game.load.image('terminalOff', 'assets/terminal_off.png');
  game.load.spritesheet('terminalOn', 'assets/terminal_on.png', 64, 96);
  game.load.image('breaker', 'assets/switch_off.png', 20, 90);
  game.load.image('breakerOn', 'assets/switch_on.png', 20, 90);
  game.load.image('intro', 'assets/intro_screen.png');
  game.load.spritesheet('electricMan', 'assets/electric_man.png', 42, 48);
  game.load.image('movable', 'assets/moveable_wall.png');
  game.load.image('flashlight', 'assets/flashlight.png');
  game.load.spritesheet('flashDying', 'assets/dying_flashlight.png', 64, 32);
  game.load.image('movable', 'assets/wall.png');
  game.load.spritesheet('batteryIcon', 'assets/battery_glow.png', 52, 35);
  game.load.spritesheet('shocked', 'assets/electrocuted.png', 64, 64);


  game.load.audio('power_off', 'sounds/power_off.wav');
  game.load.audio('power_on', 'sounds/power_on.wav');
  game.load.audio('happy_bgm', 'sounds/happy_bgm.wav');
  game.load.audio('vox_put_battery', 'sounds/vox_put_battery.wav');
  game.load.audio('vox_watch_out', 'sounds/vox_watch_out.wav');
  game.load.audio('darkness', 'sounds/darkness_bgm.wav');
  game.load.audio('scream', 'sounds/scream.wav');
  game.load.audio('zap', 'sounds/zap.wav');
}


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
  return !playerInventory.batteries.filter((battery) => battery.carried).length;
};

const pickupBattery = (player, battery) => {
  // If the player is carrying nothing, allow them to pickup a battery.
  if(isCarryingNothing()){
    battery.kill();
    carryObject(battery.name, true);
  }
  createBatteryIcon();
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

      batteryIcon.kill();
      game.sound.play('power_on');

      let targetHazard = hazards.children.find((child) => {
        return child.terminal === terminal.activator;
      });

      let newBattery = game.add.sprite(terminal.x + 6, terminal.y + 46, 'battery');
      newBattery.animations.add('glow', [0, 1, 2, 3, 4, 5], 10, true);
      newBattery.animations.play('glow');

      targetHazard.loadTexture('live_wire', 0);
      targetHazard.animations.add('electricity', [0, 1, 2, 3, 4, 5], 10, true);
      targetHazard.animations.play('electricity', 30, true);
      targetHazard.x += TILE_WIDTH + (TILE_WIDTH / 2);
      targetHazard.angle = PLAYER.DIR_DOWN;

      game.sound.play('vox_watch_out');
      DialogueManager.aW('[Your Walkie Talkie buzzes]');
      DialogueManager.aW('Leeroy! Watch out for them zappers!!');
      return;

    }



    // If player is carrying something, but it is not the activator for the terminal, shock them.
    if (!isCarried(terminal.activator)) {
    }
  }
};

const interactBreaker = (player, breaker) => {
  if(actionButton){
    //check if the player has used action button on the breaker, if so turn on hazard
    breaker.loadTexture('breakerOn');
    let callbacks = breaker.callbackArray;
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

  return batteriesDelivered === batteryArray.length || levelComplete || exitHit;
};

const createHazard = (x, y, name, terminal) => {
  const hazard = hazards.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'caution');
  hazard.body.immovable = true;
  hazard.name = name;

  hazard.deactivate = false;
  hazard.terminal = terminal; // Set terminal name that it is associated with for power
  // hazard.callbackArray = callbackArray;

  return hazard;
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
  breaker.scale.setTo(2, 2);
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

let batteryIcon;

const createBatteryIcon = () => {
  batteryIcon = batteryIcons.create(38 * TILE_WIDTH, 0.5 * TILE_HEIGHT, 'batteryIcon')
  batteryIcon.body.immovable = true;
  batteryIcon.animations.add('glow', [0, 1, 2, 3, 4, 5], 10, true);
  batteryIcon.animations.play('glow');
}


function create() {

  graphics = game.add.graphics(100, 100);

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

let playerShocked;

const interactHazard = (player, hazard) =>  {
  if(!hazard.deactivate) {
    // Check if battery is delivered to terminal and therfore on
    let terminalOn = playerInventory.batteries.find(t => t.name === hazard.terminal).delivered;
    if (terminalOn && !playerDead) {
      player.angle = PLAYER.DIR_RIGHT;
      playerShocked = true;
      player.loadTexture('shocked');
      player.scale.setTo(1.5, 1.5);
      player.x -= 1.5 * TILE_WIDTH;
      player.animations.add('shock', [0, 1, 2, 3], 10, true);
      player.animations.play('shock');

      EventManager.playSound({
        'game': game,
        'sound': 'zap'
      });

      killPlayer();
    }
  }
};

const isVisible = (obj, playerPosition) => {
  // If the object has been killed, alive will be false.  Only check objects that have been not been killed.
  if(obj.alive && PLAYER.curBatteryLife > 0){
    if(PLAYER.curBatteryLife < PLAYER.BATTERY_FLICKER){
      if(flashlightFlicker){
        return;
      }
    }
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

  flashlightFlicker = !flashlightFlicker;

  let playerPos = player.position;

  paths.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  batteries.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST  && !isCarried(element.name) && !isDelivered(element.name));
  terminals.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  walls.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  breakers.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  doors.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  hazards.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  breakers.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);

  holes.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);

  movables.children.forEach(element => element.visible = isVisible(element, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
};

const drawBatteryPercent = () => {

  // Check if the text exists.  If it doesn't, create it.
  if(typeof batteryFill === "undefined"){
    batteryFill = game.add.text(TILE_WIDTH + 35, game.height - (4 * TILE_HEIGHT) + 18, `%${PLAYER.curBatteryLife}`);
    batteryFill.addColor("white", 0); //red
  }
  // Update battery life text
  batteryFill.setText(`%${PLAYER.curBatteryLife}`);


};

const killPlayer = () => {
  playerDead = true;

  EventManager.playSound({
    'sound': 'scream',
    'game': game
  });

  if (PLAYER.curBatteryLife <= 4) {
    game.world.removeAll()
  }

  setTimeout(() => {
    player.visible = false;
    location.reload();
  }, 5000);
};

const startDrainBattery = () => {
  if(!PLAYER.batteryDraining){
    PLAYER.batteryDraining = true;
    continueDrainBattery();
  }
  if(PLAYER.curBatteryLife < PLAYER.BATTERY_DYING){
    batteryUi.animations.play('flashDying');
  }
  if(PLAYER.curBatteryLife < PLAYER.BATTERY_FALL){
    PLAYER.SIGHT_DIST = (PLAYER.curBatteryLife+1) * 32;
  }
  if(PLAYER.curBatteryLife === 0){
    killPlayer();
  }
};

const continueDrainBattery = () => {
  setTimeout(() => {
    if(!lightsOn && PLAYER.curBatteryLife > 0) PLAYER.curBatteryLife -= 1;
    continueDrainBattery();
  }, 1000);
};

function render() {
  if (currentLevel !== 0) {

  }
}

function update() {
  // Initialize cursor to listen to keyboard input
  cursors = game.input.keyboard.createCursorKeys();
  spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  levelComplete = false;
  levelComplete = currentLevel === 0 ? spaceBar.isDown : isLevelComplete();

  if (levelComplete && currentLevel === 0) {
    exitHit = false;

    levelLoading = true;
    game.world.removeAll();
    currentLevel = 1;

    // World Manager Creating Map
    const currentUpdateFunctionName = `level${currentLevel}Update`;
    WorldManager[currentUpdateFunctionName]();


    /*
    Add Groups
    */
    exits = game.add.group();
    exits.enableBody = true;

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

    batteryIcons = game.add.group();
    batteryIcons.enableBody = true;

    /*
    Create Objects in Groups
    */
    createBattery(7, 16, "battery1");
    // createBattery(20, 18, "battery7");

    createTerminal(21, 16, "battery1");

  //createMovable(10, 10);
  //createMovable(11, 11);


  //const holeX = 12;
  //const holeY = 10;
  //createHole(12, 10);

    createBreaker(24, 3, [
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
        'function': () => {lightsOn = false;},
        'args': {}
      },
      {
        'function': EventManager.playSound,
        'args': {
          'game': game,
          'sound': "power_off",
          'loop': false, // The group of objects that contain the exact hazard
          'stopOtherSounds': true
        }
      },
      {
        'function': EventManager.playSound,
        'args': {
          'game': game,
          'sound': "darkness",
          'loop': false, // The group of objects that contain the exact hazard
          'stopOtherSounds': false
        }
      },
    ]);

    const level1Hazard = createHazard(20, 13, "hazard1", "battery1");
    level1Hazard.scale.setTo(1, 2);

    createDoor(20, 2, 'door1');
    createDoor(20, 1, 'door2');

    /*
    Create Player
    */
    player = game.add.sprite(5 * TILE_WIDTH, 5 * TILE_HEIGHT, 'our_hero');
    player.scale.setTo(2, 2);
    game.physics.arcade.enable(player);
    player.body.setSize(12, 12, 10, 14);
    player.animations.add("walk", [0, 1, 2, 3], 10, true);

    dialogueText = game.add.text(
      game.width - DialogueManager.boxWidth() - DialogueManager.margin(),
      DialogueManager.margin(),
      '',
      { fontSize: '48px', fill: '#CC0' }
    );

    DialogueManager.aW('[Your Walkie Talkie buzzes]');
    DialogueManager.aW('Leeroy! Grab that battery!!');


    batteryUi = game.add.sprite(1 * TILE_WIDTH, game.height - (4 * TILE_HEIGHT), 'flashDying');
    batteryUi.animations.add('flashDying', [0, 1, 2, 3], 10, true);
    batteryUi.scale.setTo(2, 2);

    const exit = exits.create(TILE_WIDTH, TILE_HEIGHT, 'exit');
    exit.immovable = true;

    game.sound.play('vox_put_battery');

    levelLoading = false;
  } else if (levelComplete && currentLevel === 1){
    lightsOn = true;
    exitHit = false;
    levelLoading = true;
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
    */
    player= game.add.sprite(5 * TILE_WIDTH, 5 * TILE_HEIGHT, 'our_hero');
    player.scale.setTo(2, 2);
    game.physics.arcade.enable( player); player.animations.add("walk", [0, 1, 2, 3], 10, true);
    player.body.setSize(12, 12, 10, 14);
    levelLoading = false;
  } else if(isLevelComplete() && currentLevel === 2){
    levelLoading = true;
  game.world.removeAll();

      currentLevel = 3;
movables.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  holes.children.forEach(element => element.visible = isVisible(element.position, player.position) && getDistance(element.position, player.position) < PLAYER.SIGHT_DIST);
  levelLoading = false;
  } else if (isLevelComplete() && currentLevel === 3) {
    exitHit = false;
  }

  if (currentLevel !== 0 && !levelLoading) {

    DialogueManager.tick();
    dialogueText.text = DialogueManager.getDialogueText();

    if (!lightsOn) {
      hideObjects(player);
    }


    // if(isLevelComplete()){
    // }

    /*
    Add Physics
    */
    game.physics.arcade.collide(player, exits, playerHitExit, null, this);
    game.physics.arcade.collide(player, walls);
    game.physics.arcade.overlap(player, batteries, pickupBattery, null, this);
    game.physics.arcade.collide(player, terminals, interactTerminal, null, this);
    game.physics.arcade.collide(player, breakers, interactBreaker, null, this);
    game.physics.arcade.collide(player, movables);
    game.physics.arcade.collide(walls, movables);
    game.physics.arcade.collide(movables, movables);
    game.physics.arcade.collide(player, holes);
    game.physics.arcade.collide(movables, holes, fillHole, null, this);
    game.physics.arcade.overlap(player, hazards, interactHazard, null, this);
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
    if (!playerShocked) {
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
      }
      else {
        player.animations.stop();
      }
    }
    // else if (playerShocked) {
    //   player.body.immovable = true;
    //   player.animations.play('shock');
    // }


    drawBatteryPercent();
    startDrainBattery();
  }
}

function playerHitExit() {
  exitHit = true;
}
