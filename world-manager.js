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

      //builds game walls
      this.vWall(11, 8, 1);
      this.vWall(3, 8, 16);

      this.hWall(1, 1, 9);
      this.hWall(2, 6, 9);

      this.hWall(6, 9, 7);
      this.hWall(2, 12, 11);

      this.vWall(9, 14, 8);
      this.hWall(8, 14, 17);
      
      this.hWall(1, 26, 17);
      this.vWall(4, 27, 17);

      this.hWall(5, 22, 9);
      this.vWall(6, 21, 8);
      this.vWall(5, 27, 9);
      this.hWall(2, 25, 13);

      this.vWall(4, 21, 1);
      this.hWall(2, 19, 8);

      this.vWall(4, 25, 1);
      this.hWall(5, 26, 4);
      this.hWall(4, 35, 4);

      this.hWall(5, 28, 10);
      this.hWall(5, 34, 15);

      //builds game path
      //top left
      for(let i =1; i < 9; i++){
        this.hPath(7, 1, i);
      }
      //bottom left
      for(let i =0; i < 11; i++){
        this.hPath(7, 1, i + 10);
      }
      //termial B box
      for(let i =0; i < 3; i++){
        this.hPath(5, 9, i + 8);
      }
      //bottom left- 2nd in
      for(let i =0; i < 9; i++){
        this.hPath(5, 9, i + 12);
      }
      //top left- 2nd in
      for(let i =1; i < 7; i++){
        this.hPath(12, 9, i);
      }
      this.hPath(6, 15, 7)      
      for(let i =0; i < 8; i++){
        this.hPath(6, 15, i+9);
      }
      //bottom narrow path
      for(let i =0; i < 3; i++){
        this.hPath(13, 14, i+18);
      }
      //2nd b terminal box
      for(let i =0; i < 3; i++){
        this.hPath(5, 22, i+10);
      }
      //bottom right
      for(let i =0; i < 5; i++){
        this.hPath(11, 28, i+16);
      }                   
      for(let i =0; i < 5; i++){
        this.hPath(6, 28, i+11);
      } 
      //between narrow and b box 2
      for(let i =0; i < 3; i++){
        this.hPath(7, 21, i+14);
      }  
      for(let i =0; i < 4; i++){
        this.hPath(17, 22, i+5);
      }      
      for(let i =0; i < 6; i++){
        this.hPath(6, 33, i+9);
      }
      //top right   
      for(let i =1; i < 4; i++){
        this.hPath(13, 26, i);
      }  
      //2nd from right   
      for(let i =1; i < 5; i++){
        this.hPath(3, 22, i);
      }
      
      this.hPath(4, 2, 9);
      this.hPath(3, 9, 11);
      this.hPath(4, 15, 8);
      this.hPath(3, 22, 4);
      this.hPath(4, 31, 4);

      this.hPath(5, 28, 9);
      this.hPath(3, 22, 13);
      this.hPath(4, 22, 17);

      this.vPath(4, 8, 12);
      this.vPath(2, 8, 19);
      this.vPath(3, 21, 5);
      this.vPath(3, 27, 14);
      




      
    },
  };
})();
