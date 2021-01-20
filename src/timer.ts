import createClock from "./clock";

const regressiveCounter = {
  tick() {
    const progressiveFrom = this.to + this.from;
    const regressiveTo = -this.to;
    this.from--;
    
    if (this.tickAction) this.tickAction(progressiveFrom, this.to); 
    if (this.from < regressiveTo) this.stop();
  },
};

const createTimer = () => ({
  ...createClock(),
  ...regressiveCounter,
})

export default createTimer;