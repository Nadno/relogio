import clock from "./clock";

import { secondsToReadableTime } from "./formatTime";

const regressiveCounter = {
  tick() {
    this.from--;
    console.log(secondsToReadableTime(this.from));
    if (this.from <= this.to) this.stop();
  },
};

const regressiveClock = () => ({
  ...clock,
  ...regressiveCounter,
})

export default regressiveClock;