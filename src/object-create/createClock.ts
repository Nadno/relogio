import {
  starter,
  stopper,
  observer,
  Clock,
  ClockEmitters,
  ClockObservables,
} from './clock';

const clocker: Clock<ClockEmitters, ClockObservables> = {
  ...observer,
  ...starter,
  ...stopper,

  start() {
    this.current = Date.now() * 1000;
    starter.start.call(this);
  },

  tick() {
    this._emit('tick', {
      from: this.from || 0,
      to: this.to || 0,
      current: this.current,
    });
  },
};

const createClock = (): Clock<ClockEmitters, ClockObservables> =>
  Object.create(clocker);

export default createClock;
