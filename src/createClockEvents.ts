import createStopwatch from "./stopwatch";
import createTimer from "./timer";
import createPomodoro from "./pomodoro";

import confirmPopUp from "./confirmPopUp";
import createClockRender, { UnitTimeElement } from "./clockRender";

const getElementClockUnit = (id: string) =>
  Array.from(document.getElementById(id).querySelectorAll("span")).slice(-2) as unknown as UnitTimeElement;

const render = createClockRender(
  {
    hours: getElementClockUnit("clock-hours"),
    minutes: getElementClockUnit("clock-minutes"),
    seconds: getElementClockUnit("clock-seconds"),
  },
  document.getElementById("progress-bar")
);

export type ClockType = "stopwatch" | "timer" | "pomodoro";

const selectClock = (clockType: ClockType, getTime: () => string) => {
  const element = document.querySelector(".c-clock");
  let inProgress = false;

  const defaultClockStartAction = () => {
    element.classList.add("c-clock--active");
    render.resetClock();
    inProgress = true;
  };

  const defaultTickAction = (currentTime: number, time?: number) => {
    render.setClock(currentTime, time);

    const percentage = (currentTime * 100) / time;
    render.setProgressBar(percentage);
  }

  const defaultClockStopAction = () => {
    element.classList.remove("c-clock--active");
    inProgress = false;
  };

  const clocks = {
    stopwatch() {
      const clock = createStopwatch();

      const startAction = (from, to) => {
        defaultClockStartAction();
        render.setClock(from, to);
      };

      clock.setStartAction(startAction);
      clock.setTickAction(defaultTickAction);
      clock.setStopAction(defaultClockStopAction);

      return clock;
    },

    timer() {
      const clock = createTimer();

      const startAction = (_, to) => {
        defaultClockStartAction();
        render.setClock(to, to);
      };

      clock.setStartAction(startAction);
      clock.setTickAction(defaultTickAction);
      clock.setStopAction(defaultClockStopAction);

      return clock;
    },

    pomodoro() {
      const clock = createPomodoro();

      clock.setStartAction((from) => {
        defaultClockStartAction();
        render.setClock(from);
      });
      clock.setTickAction(defaultTickAction);
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
