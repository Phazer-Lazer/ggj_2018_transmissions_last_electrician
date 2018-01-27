'use strict';

const TILE_HEIGHT = 32;
const TILE_WIDTH = 32;

const game = new Phaser.Game(1280, 704, Phaser.AUTO, '', {
  preload,
  create,
  update,
});

let level = 1;
let currentLevel = level;

function preload() {
  game.load.image('path', 'assets/path.png');
  game.load.image('wall', 'assets/wall.png');
}

function create() {

}

function update() {
  const currentUpdateFunctionName = `level${currentLevel}Update`;

  WorldManager[currentUpdateFunctionName]();
}
