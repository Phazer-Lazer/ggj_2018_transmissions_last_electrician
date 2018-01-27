const WorldManager = (function () {
  return {
    levelHeight: 24,
    levelWidth: 40,
    level1Update() {
      let walls = game.add.group();
      walls.enableBody = true;
      let wall;

      //vertical border walls
      for(let w = 0; w < 24; w++){
        //left border
        wall = walls.create(0, TILE_HEIGHT * w, 'wall');
        //right border
        wall = walls.create(1280-TILE_WIDTH, TILE_HEIGHT * w, 'wall');
        wall.body.immovable = true;
      }

      //horizontal border walls
      for(let w = 0; w < 40; w++){
        //top border
        wall = walls.create(TILE_WIDTH * w, 0, 'wall');
        //bottom border
        wall = walls.create(TILE_WIDTH * w, 720-TILE_HEIGHT, 'wall');
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



    },
  };
})();