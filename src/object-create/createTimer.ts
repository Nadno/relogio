import { starter, ticker, stopper } from "./clock";
import { Clock } from "./createClock";

const timerClocker = {
  tick() {
    const regressiveFrom = this.to + this.from;
    const progressiveFrom = this.from * -1 || 0;
    const negatedTo = -this.to;
    this.from--;

    if (this.tickAction)
      this.tickAction(regressiveFrom, this.to, progressiveFrom);
    if (this.from < negatedTo) this.stop();
  },
  ...starter,
  ...ticker,
  ...stopper,
};

const createTimer = (): Clock => Object.create(timerClocker);

export default createTimer;
