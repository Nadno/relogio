import { Clock, clock } from "./clock";

const stopwatchClocker = {
  tick() {
    this.from++;
    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to); 
    if (this.from >= this.to) this.stop();
  },
}

const createStopwatch = (): Clock => {
  const newStopwatch = Object.create(clock);
  return Object.assign(newStopwatch, {
    ...stopwatchClocker,
  });
}

export default createStopwatch;