
const EventManager = (function () {
    return {
      openDoor(doors, target){
          let doorToOpen = doors.children.find(child => child.name === target);
          doorToOpen.kill();
          console.log('Opened.');
      },
      deactivateHazard(hazards, target){
          // Find individual hazard object off of hazards group
          let hazard = hazards.children.find(child => child.name === target);
          hazard.deactivate = true;
          console.log('Deactivated');
      }
    };
})();
