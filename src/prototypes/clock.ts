import { starter, ticker, stopper } from "../clock";
import { formatTimeUnit } from "../utils/formatTime";

interface FunctionAction {
  (from: number, to?: number): void;
}

export interface IClock {
  tickAction: FunctionAction | undefined;
  startAction: FunctionAction | undefined;
  stopAction: () => void | undefined;
  setTickAction(action: FunctionAction): void;
  setStartAction(action: FunctionAction): void;
  setStopAction(action: () => void): void;
  start(from?: string, to?: string): void;
  stop(): void;
  tick(): void;
}

function Clock() {
  this.tickAction = undefined;
  this.startAction = undefined;
  this.stopAction = undefined;
}

Clock.prototype = Object.create({
  ...starter,
  ...ticker,
  ...stopper,
}) as IClock;

Clock.prototype.tick = function tick() {
  const date = new Date();
  const UTCTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
  if (this.tickAction)
    this.tickAction(UTCTime.map((value) => formatTimeUnit(value)).join(":"));
};

export default Clock;
