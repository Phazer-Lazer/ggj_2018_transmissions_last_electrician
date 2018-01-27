let walls;

const WorldManager = (function () {
  return {
    levelHeight: 22,
    levelWidth: 40,
    level1Update() {
      let wall;

      walls = game.add.group();
      walls.enableBody = true;

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

      //function to create a horizontal wall
      function hWall(num, x, y){
        for(let w = 0; w < num; w++){
          wall = walls.create(x + (TILE_WIDTH * w), y, 'wall');
          wall.body.immovable = true;
        }
      };

      //function to create a vertical wall
      function vWall(num, x, y){
        for(let w = 0; w < num; w++){
          wall = walls.create(x, y + (TILE_HEIGHT * w), 'wall');
          wall.body.immovable = true;
        }
      };


      let paths = game.add.group();
      paths.enableBody = true;

      //function to create a horizontal path
      function hPath(num, x, y){
        for(let p = 0; p < num; p++){
          path = paths.create(x + (TILE_WIDTH * p), y, 'path');
          path.body.immovable = true;
        }
      };

      //function to create a vertical path
      function vPath(num, x, y){
        for(let p = 0; p < num; p++){
          path = paths.create(x, y + (TILE_HEIGHT * p), 'path');
          path.body.immovable = true;
        }
      };

      for (let i = 1; i < this.levelHeight - 1; i++ )
      hPath(this.levelWidth - 2, 1 * TILE_WIDTH, i * TILE_HEIGHT);
    },
  };
})();
