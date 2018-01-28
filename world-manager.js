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
