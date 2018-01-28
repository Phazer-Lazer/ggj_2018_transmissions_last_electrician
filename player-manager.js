const PlayerManager = (function () {
    return {
      SPEED: 750,
      DIR_DOWN: 90,
      DIR_UP: -90,
      DIR_LEFT: -180,
      DIR_RIGHT: 0,
      SIGHT_DIST: 8 * 32, // 32 is TILE_HEIGHT & TILE_WIDTH
      LIGHT_HORIZONTAL: 35, // is smaller the smaller it is
      LIGHT_VERTICAL: 35 // Is smaller the larger it is
    };
})();
