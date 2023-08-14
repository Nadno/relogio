import { starter, ticker, stopper } from "./clock";
import Clock from "./classes/clock";

const stopwatchClocker = {
  tick() {
    this.from++;
    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to);
    if (this.from >= this.to) this.stop();
  },
  ...starter,
  ...ticker,
  ...stopper,
};

const createStopwatch = (): Clock => Object.create(stopwatchClocker);

export default createStopwatch;
