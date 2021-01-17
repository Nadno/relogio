import { readableTimeToSeconds } from "./formatTime";
interface Clock {
  setTickAction(action: (UTCCurrentTime: number, UTCTime: number) => void): void;
  setStartAction(action: (UTCCurrentTime: number) => void): void;
  setStopAction(action: () => void): void;
  start(from: string, to: string): void;
  stop(): void;
  tick?: Function;
}

const clock: Clock = {
  setTickAction(callback) {
    this.tickAction = callback;
  },

  setStartAction(callback) {
    this.startAction = callback;
  },

  start(from: string = "", to: string = "") {
    const oneSecond = 1000;

    if (from) this.from = readableTimeToSeconds(from);
    if (to) this.to = readableTimeToSeconds(to);
    
    if (this.startAction) this.startAction(this.from);

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


export default clock;
