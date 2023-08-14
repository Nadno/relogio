import { readableTimeToSeconds } from "../utils/formatTime";

export const ticker = {
  setTickAction(callback) {
    this.tickAction = callback;
  },
};

export const starter = {
  setStartAction(callback) {
    this.startAction = callback;
  },

  start(from = "", to = "") {
    const oneSecond = 1000;

    if (from) this.from = readableTimeToSeconds(from);
    if (to) this.to = readableTimeToSeconds(to);

    if (this.startAction) this.startAction(this.from, this.to);

    this.tickID = setInterval(() => {
      this.tick();
    }, oneSecond);
  },
};

export const stopper = {
  setStopAction(callback: Function = null) {
    this.stopAction = callback;
  },

  stop() {
    if (this.stopAction) this.stopAction();
    clearInterval(this.tickID);
    this.from = 0;
  },
};
