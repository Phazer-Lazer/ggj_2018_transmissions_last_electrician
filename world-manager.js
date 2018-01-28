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
        wall = walls.create(TILE_WIDTH * x + (TILE_WIDTH * w), TILE_HEIGHT * y, 'wall');
        wall.body.immovable = true;
      }
    },

    //function to create a vertical wall
    vWall(num, x, y){
      for(let w = 0; w < num; w++){
        wall = walls.create(TILE_WIDTH * x, TILE_HEIGHT * y + (TILE_HEIGHT * w), 'wall');
        wall.body.immovable = true;
      }
    },

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
      game.add.sprite(0, 0, 'floor')

      walls = game.add.group();
      walls.enableBody = true;

      this.buildBorder();

      this.hWall(10, 5, 12);

      this.vWall(8, 20, 3);
      this.hWall(12, 20, 3);

      this.vWall(8, 20, 15);
      this.hWall(8, 21, 15);

      
    },

    level2Update(){
      game.add.sprite(0, 0, 'floor')
      
      walls = game.add.group();
      walls.enableBody = true;

      this.buildBorder();

      //builds game walls
      this.vWall(7, 4, 1);
      this.vWall(3, 4, 10);
      this.vWall(9, 3, 12);
      
      this.vWall(2, 7, 1);
      this.vWall(3, 7, 5);
      this.vWall(4, 6, 17);
      this.hWall(2, 8, 5);
      this.hWall(5, 14, 5);

      this.vWall(9, 10, 1);
      this.vWall(4, 10, 13);
      this.hWall(17, 7, 17);
      this.hWall(2, 22, 15);
      this.hWall(2, 22, 16);

      this.hWall(6, 13, 12);
      this.hWall(1, 18, 11);

      this.vWall(4, 24, 5);
      this.hWall(2, 25, 5);
      this.vWall(8, 27, 1);
      this.vWall(8, 28, 1);
      this.hWall(8, 29, 1);
      this.hWall(8, 29, 2);
      this.hWall(2, 29, 8);

      for(let i=0; i<3; i++){
        this.hWall(6, 33, i+6);
      }

      this.vWall(10, 27, 11);
      this.vWall(1, 26, 14);

      this.hWall(1, 30, 11);
      this.hWall(1, 33, 11);
      this.hWall(1, 36, 11);

      this.hWall(1, 30, 14);
      this.hWall(1, 33, 14);
      this.hWall(1, 36, 14);

      this.vWall(2, 30, 17);
      this.vWall(2, 33, 17);
      this.vWall(2, 36, 17);

      this.hWall(2, 37, 17);

    },
    level3Update(){
      game.add.sprite(0, 0, 'floor')
      
      walls = game.add.group();
      walls.enableBody = true;

      this.buildBorder();
    }
  };
})();