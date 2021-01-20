import Clock from "./clock";

function Stopwatch() {
  Clock.call(this);
}

Stopwatch.prototype = Object.create(Clock.prototype);
Stopwatch.prototype.tick = function tick() {
  this.from++;
  if (this.tickAction && this.from > 0) this.tickAction(this.from, this.to);
  if (this.from >= this.to) this.stop();
};

export default Stopwatch;
