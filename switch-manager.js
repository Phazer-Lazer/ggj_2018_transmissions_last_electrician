
const EventManager = (function () {
    return {
    //   openDoor(doors, name){
    //       let doorToOpen = doors.children.find(child => child.name === name);
    //       doorToOpen.body.immovable = true;
    //   },
      deactivateHazard(hazards, options){
          // Find individual hazard object off of hazards group
          let hazard = hazards.children.find(child => child.name === options);
          hazard.deactivate = true;
      }
    };
})();
