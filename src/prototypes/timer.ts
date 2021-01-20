import Clock from "./clock";

function Timer() {
  Clock.call(this);
}

Timer.prototype = Object.create(Clock.prototype);
Timer.prototype.tick = function tick() {
  const positiveFrom = this.to + this.from;
  const regressiveTo = -this.to;
  this.from--;

  console.log(positiveFrom);

  if (this.tickAction) this.tickAction(positiveFrom, this.to);
  if (this.from < regressiveTo) this.stop();
};

export default Timer;
