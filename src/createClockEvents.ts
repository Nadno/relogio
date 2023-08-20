import {
  createStopwatch,
  createTimer,
  createPomodoro,
  PomodoroClock,
} from './object-create/index';

import confirmPopUp from './confirmPopUp';
import ptBrClocks from './utils/ptBrClocks';
import { alertOnAlertSpan } from './utils/accessibilityAlert';
import createClockRender, { UnitTimeElement } from './clockRender';

const getElementClockUnit = (id: string) =>
  Array.from(document.getElementById(id).querySelectorAll('span')).slice(
    -2
  ) as unknown as UnitTimeElement;

const render = createClockRender(
  {
    hours: getElementClockUnit('clock-hours'),
    minutes: getElementClockUnit('clock-minutes'),
    seconds: getElementClockUnit('clock-seconds'),
  },
  document.getElementById('progress-bar')
);

export type ClockType = 'stopwatch' | 'timer' | 'pomodoro';

const selectClock = (clockType: ClockType, getTime: () => string) => {
  const element = document.querySelector('.c-clock');
  let inProgress = false;

  const defaultClockStartAction = () => {
    render.resetClock();
    element.classList.add('c-clock--active');
    alertOnAlertSpan(`${ptBrClocks[clockType]} iniciado`);

    inProgress = true;
  };

  const defaultTickAction = ({ current, from, to }) => {
    render.setClock(current, to);

    const progressive = {
      /**
       * The timer clock, expects that `from` is higher then `to`,
       * so we need to handle the data to calculate the percentage.
       */
      from: Math.min(from, to),
      to: Math.max(from, to),
      current: from > to ? from - current : current,
    };

    const percentage = (progressive.current * 100) / progressive.to;

    if (percentage >= 50 && percentage < 51) {
      alertOnAlertSpan(`${ptBrClocks[clockType]} 50% completo`);
    }

    render.setProgressBar(percentage);
  };

  const defaultClockStopAction = () => {
    element.classList.remove('c-clock--active');
    if (clockType !== 'pomodoro')
      alertOnAlertSpan(`${ptBrClocks[clockType]}, finalizado`);
    inProgress = false;
  };

  const clocks = {
    stopwatch() {
      const clock = createStopwatch();

      const startAction = ({ from, to }) => {
        defaultClockStartAction();
        render.setClock(from, to);
      };

      clock.on('start', startAction);
      clock.on('tick', defaultTickAction);
      clock.on('stop', defaultClockStopAction);

      const start = () => clock.start('00:00:00', getTime()),
        stop = () => clock.stop();

      return [start, stop];
    },

    timer() {
      const clock = createTimer();

      const startAction = ({ from }) => {
        defaultClockStartAction();
        render.setClock(from, from);
      };

      clock.on('start', startAction);
      clock.on('tick', defaultTickAction);
      clock.on('stop', defaultClockStopAction);

      const start = () => clock.start(getTime(), '00:00:00'),
        stop = () => clock.stop();

      return [start, stop];
    },

    pomodoro() {
      const clock = createPomodoro<PomodoroClock>();

      clock.on('start', ({ from }) => {
        defaultClockStartAction();
        render.setClock(from);
      });

      clock.on('tick', defaultTickAction);
      clock.setConfirmEvent(confirmPopUp);
      clock.on('stop', defaultClockStopAction);

      const start = () => clock.start(),
        stop = () => clock.stop();

      return [start, stop];
    },
  };

  const [start, stop] = clocks[clockType]();

  const startClock = () => {
    if (inProgress) return;
    start();
  };

  const stopClock = () => {
    if (!inProgress) return;
    stop();
  };

  return [startClock, stopClock];
};

export default selectClock;
