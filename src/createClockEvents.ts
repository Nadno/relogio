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
import { ClockTimeHandler } from './object-create/clock';

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

  const defaultClockStartAction: ClockTimeHandler = ({ from, to }) => {
    render.resetClock();

    requestAnimationFrame(() => {
      render.setClock(from);
      element.classList.add('c-clock--active');
      alertOnAlertSpan(`${ptBrClocks[clockType]} iniciado`);
    });

    inProgress = true;
  };

  const defaultTickAction: ClockTimeHandler = ({ current, from, to }) => {
    render.setClock(current);

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

  const defaultClockStopAction: ClockTimeHandler = () => {
    element.classList.remove('c-clock--active');
    if (clockType !== 'pomodoro')
      alertOnAlertSpan(`${ptBrClocks[clockType]}, finalizado`);
    inProgress = false;
  };

  const createClock = (type: 'timer' | 'stopwatch' | 'pomodoro') => {
    const clock = {
      timer: createTimer,
      stopwatch: createStopwatch,
      pomodoro: createPomodoro,
    }[type]();

    clock.on('start', defaultClockStartAction);
    clock.on('tick', defaultTickAction);
    clock.on('stop', defaultClockStopAction);

    return clock;
  };

  const clocks = {
    stopwatch() {
      const clock = createClock('stopwatch');

      const start = () => clock.start('00:00:00', getTime()),
        stop = () => clock.stop();

      return [start, stop];
    },

    timer() {
      const clock = createClock('timer');

      const start = () => clock.start(getTime(), '00:00:00'),
        stop = () => clock.stop();

      return [start, stop];
    },

    pomodoro() {
      const clock = createClock('pomodoro') as PomodoroClock;

      clock.on('pause', () => {
        const confirmAction = (confirm: boolean) => {
          if (!confirm) return;
          clock.start();
        };

        confirmPopUp(
          {
            title: 'Pomodoro completo',
            description: 'Você quer iniciar uma pausa?',
          },
          confirmAction
        );
      });

      clock.on('focus', () => {
        const confirmAction = (confirm: boolean) => {
          if (!confirm) return;
          clock.start();
        };

        confirmPopUp(
          {
            title: 'Pausa completa',
            description: 'Você quer iniciar um novo pomodoro?',
          },
          confirmAction
        );
      });

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
