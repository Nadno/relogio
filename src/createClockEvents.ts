import createStopwatch from "./createStopwatch";
import createTimer from "./createTimer";
import createPomodoro from "./createPomodoro";

import confirmPopUp from "./confirmPopUp";
import ptBrClocks from "./utils/ptBrClocks";
import { alertOnAlertSpan } from "./utils/accessibilityAlert";
import createClockRender, { UnitTimeElement } from "./clockRender";

const getElementClockUnit = (id: string) =>
  (Array.from(document.getElementById(id).querySelectorAll("span")).slice(
    -2
  ) as unknown) as UnitTimeElement;

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
    render.resetClock();
    element.classList.add("c-clock--active");
    alertOnAlertSpan(`${ptBrClocks[clockType]} iniciado`);

    inProgress = true;
  };

  const defaultTickAction = (
    currentTime: number,
    time?: number,
    progressiveTimer?: number
  ) => {
    render.setClock(currentTime, time);

    const percentage = progressiveTimer >= 0
      ? (progressiveTimer * 100) / time
      : (currentTime * 100) / time;

    if (percentage >= 50 && percentage < 51) {
      alertOnAlertSpan(`${ptBrClocks[clockType]} 50% completo`);
    }

    render.setProgressBar(percentage);
  };

  const defaultClockStopAction = () => {
    element.classList.remove("c-clock--active");
    if (clockType !== "pomodoro") 
      alertOnAlertSpan(`${ptBrClocks[clockType]}, finalizado`);
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
      clock.setConfirmEvent(confirmPopUp);

      clock.setStopAction(defaultClockStopAction);

      return clock;
    },
  };

  const clock = clocks[clockType]();

  const startEvent = () => {
    if (inProgress) return;
    const time = clockType === "pomodoro" ? "" : getTime();
    clock.start("00:00:00", time);
  };

  const stopEvent = () => {
    if (!inProgress) return;
    clock.stop();
  };

  return [startEvent, stopEvent];
};

export default selectClock;
