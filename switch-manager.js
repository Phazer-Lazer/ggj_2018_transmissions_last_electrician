
const EventManager = (function () {
    return {
      openDoor(args){
          let doorToOpen = args.targetGroup.children.find(child => child.name === args.target);
          doorToOpen.kill();
          console.log('Opened.');
      },
      deactivateHazard(args){
          // Find individual hazard object off o    f hazards group
          let hazard = args.targetGroup.children.find(child => child.name === args.target);
          hazard.deactivate = true;
          console.log('Deactivated');
      },
      playSound(args){
          // Game must be passed in to be able to check if souund is already being played.
          let alreadyPlaying = false;

          // Check if sound is already being played.
          let sound = args.game.sound._sounds.find(song => song.name === args.sound);
          // * 1000 to change seconds to milliseconds
          if(typeof sound !== "undefined" && sound.currentTime <= sound.duration*1000) alreadyPlaying = true;


          if(!alreadyPlaying){
            if(args.stopOtherSounds){
                args.game.sound.stopAll();
            }
            let playSound = args.game.sound.play(args.sound);
            if(args.loop){
                playSound.loopFull();
            }
        }
    }
    };
})();
