const WorldManager = (function () {
  return {
    levelHeight: 24,
    levelWidth: 40,
    level1Update() {
      let walls = game.add.group();
      walls.enableBody = true;
      let wall;

      //size of block
      let block = 32;
 
      for(let w = 0; w < 24; w++){
        //left border
        wall = walls.create(0, block * w, 'wall');
        //right border
        wall = walls.create(1280-block, block * w, 'wall');
        wall.body.immovable = true;
      }

      for(let w = 0; w < 40; w++){
        //top border
        wall = walls.create(block * w, 0, 'wall');
        //bottom border
        wall = walls.create(block * w, 720-block, 'wall');
        wall.body.immovable = true;
      }
      
      //creates a horizontal wall
      function hWall(num, x, y){
        for(let w = 0; w < num; w++){
          wall = walls.create(x + (block * w), y, 'wall');
          wall.body.immovable = true;
        }
      }

      //creates a vertical wall
      function vWall(num, x, y){
        for(let w = 0; w < num; w++){
          wall = walls.create(x, y + (block * w), 'wall');
          wall.body.immovable = true;
        }
      }







      let paths = game.add.group();
      paths.enableBody = true;

      let path = paths.create(32, 64, 'path');
      path.body.immovable = true;

      path = paths.create(64, 32, 'path');
      path.body.immovable = true;


    },
  };
})();