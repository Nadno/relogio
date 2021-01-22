import { alertOnAlertSpan } from "./utils/accessibilityAlert";
import startAnimate from "./utils/animate";
import { formatTimeUnit, secondsToMinutes, secondsToReadableTime } from "./utils/formatTime";

export type UnitTimeElement = readonly [HTMLElement, HTMLElement];

const createClockRender = (
  timeElement: {
    readonly hours: UnitTimeElement;
    readonly minutes: UnitTimeElement;
    readonly seconds: UnitTimeElement;
  },
  progressBarElement?: HTMLElement
) => {
  const hours: string[] = ["0", "0"],
    minutes: string[] = ["0", "0"],
    seconds: string[] = ["0", "0"];
  const renderedTime = [hours, minutes, seconds];

  const elementTimeUnits = ["hours", "minutes", "seconds"];
  let passedMinutes = 0;

  const resetClock = () => {
    renderedTime.forEach((unit, index) => {
      const element = elementTimeUnits[index];
      const [firstMinUnitElement, secondMinUnitElement] = timeElement[element];

      firstMinUnitElement.innerHTML = "0";
      secondMinUnitElement.innerHTML = "0";

      unit[0] = "0";
      unit[1] = "0";
    });
    passedMinutes = 0;
  };

  const alertMinutes = (currentTime: number) => {
    const minutes = secondsToMinutes(currentTime);
    if (minutes && minutes > passedMinutes) {
      passedMinutes = minutes;
      alertOnAlertSpan(`${ minutes > 1 ? `${minutes} minutos decorridos` : `${minutes} minuto decorrido`}`);
    }
  }

  const setMinUnitElement = ({ value, unitIndex, minUnitIndex }) => {
    const unitElement = elementTimeUnits[unitIndex];
    const minUnitElement = timeElement[unitElement][minUnitIndex];

    minUnitElement.innerHTML = value;
    startAnimate(minUnitElement);
  };

  const setRenderedTime = ({ value, unitIndex, minUnitIndex }) => {
    renderedTime[unitIndex][minUnitIndex] = value;
  };

  const render = (timeArrayProps: {
    value: string;
    unitIndex: number;
    minUnitIndex: number;
  }) => {
    setMinUnitElement(timeArrayProps);
    setRenderedTime(timeArrayProps);
  };

  function setProgressBar(percentage: number) {
    try {
      progressBarElement.style.width = percentage.toFixed(2) + "%";
      progressBarElement.setAttribute("aria-valuenow", percentage.toFixed(0));
    } catch (err) {
      throw new Error(err);
    }
  }

  const getTimeUnitAsArray = (value: number) =>
    formatTimeUnit(value).split("") as [string, string];

  function setClock(currentTime: number, time?: number) {
    alertMinutes(currentTime)

    const renderReadableTime = (value: number, unitIndex: number) => {
      const [secondMinUnit, firstMinUnit] = getTimeUnitAsArray(value);
      const [secondRenderedMinUnit, firstRenderedMinUnit] = renderedTime[
        unitIndex
      ];


      if (firstMinUnit !== firstRenderedMinUnit) {
        const minUnitIndex = 1;
        render({
          value: firstMinUnit,
          unitIndex,
          minUnitIndex,
        });
      }

      if (secondMinUnit !== secondRenderedMinUnit) {
        const minUnitIndex = 0;
        render({
          value: secondMinUnit,
          unitIndex,
          minUnitIndex,
        });
      }
    };

    secondsToReadableTime(currentTime).forEach(renderReadableTime);
  }

  return {
    resetClock,
    setClock,
    setProgressBar,
  };
};

export default createClockRender;
