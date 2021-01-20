import Clock from "./clock";

class StopwatchClock extends Clock {
  tick() {
    this.from++;
    if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to); 
    if (this.from >= this.to) this.stop();
  }
}

export default StopwatchClock;