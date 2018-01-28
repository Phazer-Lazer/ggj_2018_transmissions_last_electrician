
const EventManager = (function () {
    return {
      openDoor(doors, name){
          let doorToOpen = doors.children.find(child => child.name === name);
          doorToOpen.body.immovable = true;
      },
      deactivateHazard(hazard){
          hazard.deactivated = true;
      }
    };
})();
