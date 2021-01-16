import { readableTimeToSeconds, secondsToReadableTime } from "./formatTime";
interface TickAction {
  (UTCTime: number): void;
}

const clock = {
  setTickAction(callback: TickAction = () => {}) {
    this.startAction = callback;
  },

  start(from: string = "", to: string = "") {
    const oneSecond = 1000;

    if (from) this.from = readableTimeToSeconds(from);
    if (to) this.to = readableTimeToSeconds(to);

    this.tickID = setInterval(() => {
      this.tick();
    }, oneSecond);
  },

  setStopAction(callback: Function = () => {}) {
    this.stopAction = callback;
  },

  stop() {
    clearInterval(this.tickID);
    this.stopAction();
    this.from = 0;
  },
};


export default clock;
