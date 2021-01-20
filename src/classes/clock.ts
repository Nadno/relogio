import { readableTimeToSeconds, formatTimeUnit } from "../utils/formatTime";

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

class Clock implements IClock {
  tickID;
  from;
  to;

  tickAction;
  startAction;
  stopAction;

  setTickAction(action: FunctionAction) {
    this.tickAction = action;
  }

  setStartAction(action: FunctionAction) {
    this.startAction = action;
  }

  start(from = "", to = "") {
    const oneSecond = 1000;

    if (from && !this.from) this.from = readableTimeToSeconds(from);
    if (to && !this.to) this.to = readableTimeToSeconds(to);

    if (this.startAction) this.startAction(this.from, this.to);

    this.tickID = setInterval(() => {
      this.tick();
    }, oneSecond);
  }

  tick() {
    const date = new Date();
    const UTCTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if (this.tickAction)
      this.tickAction(UTCTime.map((value) => formatTimeUnit(value)).join(":"));
  }

  setStopAction(callback) {
    this.stopAction = callback;
  }

  stop() {
    if (this.stopAction) this.stopAction();
    clearInterval(this.tickID);
    this.from = 0;
  }
}

export default Clock;
