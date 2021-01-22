import { Clock, clock } from "./clock";

const timerClocker = {
  tick() {
    const regressiveFrom = this.to + this.from;
    const progressiveFrom = this.from * -1 || 0;
    const negatedTo = -this.to;
    this.from--;

    
    if (this.tickAction) this.tickAction(regressiveFrom, this.to, progressiveFrom); 
    if (this.from < negatedTo) this.stop();
  },
};

const createTimer = (): Clock => {
  const newTimer = Object.create(clock);
  return Object.assign(newTimer, {
    ...timerClocker,
  });
}

export default createTimer;