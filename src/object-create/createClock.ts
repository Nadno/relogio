import { starter, ticker, stopper } from "./clock";
import { formatTimeUnit } from "./utils/formatTime";

export interface Clock {
  setTickAction(
    action: (UTCCurrentTime: number, UTCTime: number) => void
  ): void;
  setStartAction(action: (from: number, to: number) => void): void;
  setStopAction(action: () => void): void;
  start(from?: string, to?: string): void;
  stop(): void;
  tick?(): void;
}

const clocker = {
  tick() {
    const date = new Date();
    const UTCTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if (this.tickAction)
      this.tickAction(UTCTime.map((value) => formatTimeUnit(value)).join(":"));
  },
  ...starter,
  ...ticker,
  ...stopper,
};

const createClock = (): Clock => Object.create(clocker);

export default createClock;
