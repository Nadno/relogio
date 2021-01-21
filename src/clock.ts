import { readableTimeToSeconds, formatTimeUnit } from "./utils/formatTime";
export interface Clock {
  setTickAction(action: (UTCCurrentTime: number, UTCTime: number) => void): void;
  setStartAction(action: (from: number, to: number) => void): void;
  setStopAction(action: () => void): void;
  start(from?: string, to?: string): void;
  stop(): void;
  tick?(): void;
}

export const clock = {
  setTickAction(callback) {
    this.tickAction = callback;
  },

  setStartAction(callback) {
    this.startAction = callback;
  },

  start(from = "", to = "") {
    const oneSecond = 1000;

    if (from) this.from = readableTimeToSeconds(from);
    if (to && !this.to) this.to = readableTimeToSeconds(to);
    
    if (this.startAction) this.startAction(this.from, this.to);

    this.tickID = setInterval(() => {
      this.tick();
    }, oneSecond);
  },

  setStopAction(callback: Function = null) {
    this.stopAction = callback;
  },

  stop() {
    if (this.stopAction) this.stopAction();
    clearInterval(this.tickID);
    this.from = 0;
  },
};

const clocker = {
  tick() {
    const date = new Date();
    const UTCTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if (this.tickAction) this.tickAction(UTCTime.map(value => formatTimeUnit(value)).join(":")); 
  },
}

const createClock = (): Clock => {
  const newClock = Object.create(clock);
  return Object.assign(newClock, {
    ...clocker,
  });
};

export default createClock;
