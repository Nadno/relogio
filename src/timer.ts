import { Clock, clock } from "./clock";

const timerClocker = {
  tick() {
    const progressiveFrom = this.to + this.from;
    const regressiveTo = -this.to;
    this.from--;
    
    if (this.tickAction) this.tickAction(progressiveFrom, this.to); 
    if (this.from < regressiveTo) this.stop();
  },
};

const createTimer = (): Clock => {
  const newTimer = Object.create(clock);
  return Object.assign(newTimer, {
    ...timerClocker,
  });
}

export default createTimer;