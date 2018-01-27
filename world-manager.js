const WorldManager = (function () {
  return {
    levelHeight: 24,
    levelWidth: 32,
    level1Update() {
      let walls = game.add.group();
      walls.enableBody = true;

      let wall = walls.create(64, 64, 'wall');
      wall.body.immovable = true;

      wall = walls.create(32, 32, 'wall');
      wall.body.immovable = true;

      let paths = game.add.group();
      paths.enableBody = true;

      let path = paths.create(32, 64, 'path');
      path.body.immovable = true;

      path = paths.create(64, 32, 'path');
      path.body.immovable = true;
    },
  };
})();
