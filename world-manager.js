let walls;
let wall;

let paths;
let path;


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

    level1Update() {

      walls = game.add.group();
      walls.enableBody = true;
      
      paths = game.add.group();
      paths.enableBody = true;
      
      this.buildBorder();
      this.hWall(8, 32*6, 32*16);
      
      this.vWall(9, 32*20, 32*3);
      this.hWall(12, 32*20, 32*3);
      
      this.vWall(8, 32*20, 32*15);
      this.hWall(8, 32*21, 32*15);
      
      // for (let i = 1; i < this.levelHeight - 1; i++ )
      // this.hPath(this.levelWidth - 2, 1 * TILE_WIDTH, i * TILE_HEIGHT);

    },
  };
})();
