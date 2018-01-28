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

    //function to create a horizontal path
    hPath(num, x, y){
      for(let p = 0; p < num; p++){
        path = paths.create(TILE_WIDTH * x + (TILE_WIDTH * p), TILE_HEIGHT * y, 'path');
        path.body.immovable = true;
      }
    },

    //function to create a vertical path
    vPath(num, x, y){
      for(let p = 0; p < num; p++){
        path = paths.create(TILE_WIDTH * x, TILE_HEIGHT * y + (TILE_HEIGHT * p), 'path');
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
      this.hWall(10, 5, 12);

      this.vWall(8, 20, 3);
      this.hWall(12, 20, 3);

      this.vWall(8, 20, 15);
      this.hWall(8, 21, 15);

      //builds path top left of screeen
      for(let i =1; i < 12; i++){
        this.hPath(19, 1, i );
      }

      //builds paths next to horizontal wall on left
      this.hPath(4, 1, 12);
      this.hPath(5, 15, 12);

      //build path bottom left
      for(let i =1; i < 9; i++){
        this.hPath(19, 1, (i+12));
      }

      //builds path on the right
      for(let i =1; i < 21; i++){
        this.hPath(7, 32, i );
      }

      //builds path between the two vertical walls
      this.vPath(4, 20, 11);

      //builds path above horizontal wall toward the top
      for(let i =0; i < 2; i++){
        this.hPath(12, 20, (i + 1));
      }
      //builds path under horizontal wall toward the top
      for(let i =0; i < 11; i++){
        this.hPath(11, 21, (i + 4));
      }

      //builds path under horizontal wall toward the bottom
      this.hPath(3, 29, 15);

      for(let i =0; i < 5; i++){
        this.hPath(11, 21, i + (this.levelHeight-6));
      }


    },

    level2Update(){

      walls = game.add.group();
      walls.enableBody = true;

      paths = game.add.group();
      paths.enableBody = true;

      this.buildBorder();

      this.vWall(10, 8, 1);
      this.vWall(4, 8, 14);



      
    },
  };
})();
