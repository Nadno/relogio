import createClock from "./clock";

import { secondsToReadableTime } from "./formatTime";

const regressiveCounter = {
  tick() {
    const progressiveFrom = this.to + this.from;
    const regressiveTo = -this.to;
    this.from--;
    
    if (this.tickAction) this.tickAction(progressiveFrom, this.to); 
    if (this.from < regressiveTo) this.stop();
  },
};

const regressiveClock = () => ({
  ...createClock(),
  ...regressiveCounter,
})

export default regressiveClock;