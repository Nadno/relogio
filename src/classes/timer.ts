import Clock from "./clock";

class TimerClock extends Clock {
  tick() {
    const positiveFrom = this.to + this.from;
    const regressiveTo = -this.to;
    this.from--;

    console.log(positiveFrom);
    
    if (this.tickAction) this.tickAction(positiveFrom, this.to); 
    if (this.from < regressiveTo) this.stop();
  }
};

export default TimerClock;