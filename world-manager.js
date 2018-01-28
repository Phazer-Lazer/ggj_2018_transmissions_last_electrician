let paths;
let path;

let walls;
let wall;

const WorldManager = (function () {
  return {
    levelHeight: 22,
    levelWidth: 40,

    buildBorder(){
      //vertical border walls
      for(let w = 0; w < this.levelHeight; w++){
        //left border
        wall = walls.create(0, TILE_HEIGHT * w, 'wall');
        wall.body.immovable = true;
        //right border
        wall = walls.create(game.world.width-TILE_WIDTH, TILE_HEIGHT * w, 'wall');
        wall.body.immovable = true;
      }

      //horizontal border walls
      for(let w = 0; w < this.levelWidth; w++){
        //top border
        wall = walls.create(TILE_WIDTH * w, 0, 'wall');
        wall.body.immovable = true;
        //bottom border
        wall = walls.create(TILE_WIDTH * w, game.world.height-TILE_HEIGHT, 'wall');
        wall.body.immovable = true;
      }
    },
    //function to create a horizontal wall
    hWall(num, x, y){
      for(let w = 0; w < num; w++){
        wall = walls.create(x + (TILE_WIDTH * w), y, 'wall');
        wall.body.immovable = true;
      }
    },

    //function to create a vertical wall
    vWall(num, x, y){
      for(let w = 0; w < num; w++){
        wall = walls.create(x, y + (TILE_HEIGHT * w), 'wall');
        wall.body.immovable = true;
      }
    },

    //function to create a horizontal path
    hPath(num, x, y){
      for(let p = 0; p < num; p++){
        path = paths.create(x + (TILE_WIDTH * p), y, 'path');
        path.body.immovable = true;
      }
    },

    //function to create a vertical path
    vPath(num, x, y){
      for(let p = 0; p < num; p++){
        path = paths.create(x, y + (TILE_HEIGHT * p), 'path');
        path.body.immovable = true;
      }
    },

    // carryObject (name, value) {
    //   let object = playerInventory.batteries.find(b => b.name === name);
    //   object.carried = value;
    // },

    // deliverObject (name) {
    //   let object = playerInventory.batteries.find(b => b.name === name);
    //   object.delivered = true;
    //   console.log(object);
    // },


    // isCarried (name) {
    //   return playerInventory.batteries.find(x => x.name === name).carried;
    // },

    // isDelivered (name) {
    //   return playerInventory.batteries.find(x => x.name === name).delivered;
    // },

    // // Return true if player is carrying nothing
    // isCarryingNothing () {
    //   return playerInventory.batteries.filter((battery) => battery.carried).length ? false : true;
    // },

    // pickupBattery (player, battery) {
    //   // If the player is carrying nothing, allow them to pickup a battery.
    //   if(isCarryingNothing()){
    //     battery.kill();
    //     carryObject(battery.name, true);
    //   }
    // },

    // interactTerminal (player, terminal) {
    //   // Check if object has been delivered and player is carrying nothing, if so, exit.
    //   if (this.isDelivered(terminal.activator) || this.isCarryingNothing()) {
    //     return;
    //   }

    //   // If player is carrying the activator, deliver it and exit.
    //   if (this.isCarried(terminal.activator)) {
    //     this.carryObject(terminal.activator, false);
    //     this.deliverObject(terminal.activator);
    //     // Set terminal image to activated
    //     terminal.loadTexture('terminalOn');
    //     terminal.animations.add('on', [0, 1, 2, 3, 4, 5], 6, true);
    //     terminal.animations.play('on');

    //     let newBattery = game.add.sprite(terminal.x + 6, terminal.y + 46, 'battery');
    //     newBattery.animations.add('glow', [0, 1, 2, 3, 4, 5], 10, true);
    //     newBattery.animations.play('glow');
    //     return;
    //   }


    //   // If player is carrying something, but it is not the activator for the terminal, shock them.
    //   if (!isCarried(terminal.activator)) {
    //     console.log('shock');
    //   }

    // },

    createBattery (x, y, name) {
      // battery = batteries.create(x * TILE_WIDTH,  y * TILE_HEIGHT, 'battery');
      // battery.name = name;
      battery = batteries.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'battery');
      // game.physics.arcade.enable(player);
      battery.animations.add('glow', [0, 1, 2, 3, 4, 5], 10, true);
      battery.animations.play('glow');
      battery.name = name;
    },

    createTerminal (x, y, activator) {
      // Set terminal image based on wether or not it is delivered.
      // const battery = batteries.create(x * TILE_WIDTH,  y * TILE_HEIGHT, 'battery');
      // battery.name = name;
      const terminal = terminals.create(x * TILE_WIDTH, y * TILE_HEIGHT, 'terminalOff');
      // game.physics.arcade.enable(player);

      terminal.body.immovable = true;
      terminal.activator = activator;
    },

    level1Update() {

      walls = game.add.group();
      walls.enableBody = true;

      paths = game.add.group();
      paths.enableBody = true;

      this.buildBorder();
      this.hWall(10, TILE_WIDTH*5, TILE_HEIGHT*12);

      this.vWall(8, TILE_WIDTH*20, TILE_HEIGHT*3);
      this.hWall(12, TILE_WIDTH*20, 32*3);

      this.vWall(8, TILE_WIDTH*20, TILE_HEIGHT*15);
      this.hWall(8, TILE_WIDTH*21, TILE_HEIGHT*15);

      //builds path top left of screeen
      for(let i =1; i < 12; i++){
        this.hPath(19, TILE_WIDTH, i * TILE_HEIGHT);
      }

      //builds paths next to horizontal wall on left
      this.hPath(4, TILE_WIDTH, TILE_HEIGHT*12);
      this.hPath(5, TILE_WIDTH*15, TILE_HEIGHT*12);

      //build path bottom left
      for(let i =1; i < 9; i++){
        this.hPath(19, TILE_WIDTH, (i+12) * TILE_HEIGHT);
      }

      //builds path on the right
      for(let i =1; i < 21; i++){
        this.hPath(7, TILE_WIDTH*32, i * TILE_HEIGHT);
      }

      //builds path between the two vertical walls
      this.vPath(4, TILE_WIDTH*20, TILE_HEIGHT*11);

      //builds path above horizontal wall toward the top
      for(let i =0; i < 2; i++){
        this.hPath(12, TILE_WIDTH*20, ((i + 1)* TILE_HEIGHT));
      }
      //builds path under horizontal wall toward the top
      for(let i =0; i < 11; i++){
        this.hPath(11, TILE_WIDTH*21, ((i + 4)* TILE_HEIGHT));
      }

      //builds path under horizontal wall toward the bottom
      this.hPath(3, TILE_WIDTH*29, TILE_HEIGHT*15);

      for(let i =0; i < 5; i++){
        this.hPath(11, TILE_WIDTH*21, ((i + (this.levelHeight-6))* TILE_HEIGHT));
      }

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
      this.createBattery(7, 16, "battery1");

      this.createTerminal(21, 16, "battery1");


      /*
      Create Player
      */
      player = game.add.sprite(5 * TILE_WIDTH, 5 * TILE_HEIGHT, 'our_hero');
      player.scale.setTo(2, 2);
      game.physics.arcade.enable(player);
      player.animations.add("walk", [0, 1, 2, 3], 10, true);

    },

    level2Update(){

      walls = game.add.group();
      walls.enableBody = true;

      paths = game.add.group();
      paths.enableBody = true;

      this.buildBorder();

      this.vWall(10, TILE_WIDTH*8, TILE_HEIGHT*1);
      this.vWall(4, TILE_WIDTH*8, TILE_HEIGHT*14);



      
    },
  };
})();
