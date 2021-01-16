import clock from "./clock";

const progressiveCounter = {
  tick() {
    this.from++;
    if (this.from > 0) this.startAction(this.from);
    if (this.from >= this.to) this.stop();
  },
}

const progressiveClock = () => ({
  ...clock,
  ...progressiveCounter,
})

export default progressiveClock