import createClock from "./clock";

import { secondsToReadableTime } from "./formatTime";

const regressiveCounter = {
  tick() {
    this.to--;
    if (this.tickAction) this.tickAction(this.to, this.from); 
    if (this.to <= this.from) this.stop();
  },
};

const regressiveClock = () => ({
  ...createClock(),
  ...regressiveCounter,
})

export default regressiveClock;