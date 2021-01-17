import createClock from "./clock";

const progressiveCounter = {
  tick() {
    this.from++;
    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to); 
    if (this.from >= this.to) this.stop();
  },
}

const progressiveClock = () => ({
  ...createClock(),
  ...progressiveCounter,
})

export default progressiveClock;