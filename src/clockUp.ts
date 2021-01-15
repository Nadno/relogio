import clock from "./clock";

import { secondsToReadableTime } from "./formatTime";

const progressiveCounter = {
  tick() {
    this.from++;
    console.log(secondsToReadableTime(this.from));
    if (this.from >= this.to) this.stop();
  }
}

const progressiveClock = () => ({
  ...clock,
  ...progressiveCounter,
})

export default progressiveClock