import createClock from "./clock";

const progressiveCounter = {
  tick() {
    this.from++;
    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to); 
    if (this.from >= this.to) this.stop();
  },
}

const createStopWatchClock = () => ({
  ...createClock(),
  ...progressiveCounter,
})

export default createStopWatchClock;