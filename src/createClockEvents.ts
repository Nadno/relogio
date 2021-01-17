import progressiveClock from "./clockUp";
import regressiveClock from "./clockDown";
import pomodoroClock from "./clockPomodoro";
import createRenderTime from "./renderReadableTime";
import confirmPopUp from "./confirmPopUp";

const getElementClockUnit = (id: string) =>
  Array.from(document.getElementById(id).querySelectorAll("span")).slice(-2);

const render = createRenderTime(
  {
    hours: getElementClockUnit("clock-hours"),
    minutes: getElementClockUnit("clock-minutes"),
    seconds: getElementClockUnit("clock-seconds"),
  },
  document.getElementById("progress-bar")
);

export type ClockType = "progressive" | "regressive" | "pomodoro";

const selectClock = (clockType: ClockType, getTime: () => string) => {
  const element = document.querySelector(".c-clock");
  let inProgress = false;

  const defaultClockStartAction = () => {
    element.classList.add("c-clock--active");
    render.resetRenderedTime();
    inProgress = true;
  };

  const defaultClockStopAction = () => {
    element.classList.remove("c-clock--active");
    inProgress = false;
  };

  const clocks = {
    progressive() {
      const clock = progressiveClock();

      clock.setStartAction((from) => {
        defaultClockStartAction();
        render.renderReadableTime(from);
      });
      clock.setTickAction(render.renderReadableTime);
      clock.setStopAction(defaultClockStopAction);

      return clock;
    },

    regressive() {
      const clock = regressiveClock();

      clock.setStartAction((_, to) => {
        defaultClockStartAction();
        render.renderReadableTime(to);
      });
      clock.setTickAction(render.renderReadableTime);
      clock.setStopAction(defaultClockStopAction);

      return clock;
    },

    pomodoro() {
      const clock = pomodoroClock();

      clock.setStartAction((from) => {
        defaultClockStartAction();
        render.renderReadableTime(from);
      });
      clock.setTickAction(render.renderReadableTime);
      clock.setConfirmAction(confirmPopUp);
      
      clock.setStopAction(defaultClockStopAction);

      return clock;
    },
  };

  const clock = clocks[clockType]();

  const startEvent = () => {
    if (inProgress) return;
    clock.start("00:00:00", getTime());
  };

  const stopEvent = () => {
    if (!inProgress) return;
    clock.stop();
  };

  return [startEvent, stopEvent];
};

export default selectClock;
