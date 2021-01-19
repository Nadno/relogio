import { formatTimeUnit, secondsToReadableTime } from "./formatTime";

const createRenderTime = (
  timeElement: {
    readonly hours: ReadonlyArray<HTMLElement>;
    readonly minutes: ReadonlyArray<HTMLElement>;
    readonly seconds: ReadonlyArray<HTMLElement>;
  },
  progressBarElement?: HTMLElement
) => {
  const hours: string[] = ["0", "0"],
    minutes: string[] = ["0", "0"],
    seconds: string[] = ["0", "0"];
  const currentTime = [hours, minutes, seconds];

  const elementTimeUnits = ["hours", "minutes", "seconds"];

  const resetRenderedTime = () => {
    currentTime.forEach((unit, index) => {
      const element = elementTimeUnits[index];
      const [firstMinUnitElement, secondMinUnitElement] = timeElement[element];

      firstMinUnitElement.innerHTML = "0";
      secondMinUnitElement.innerHTML = "0";

      unit[0] = "0";
      unit[1] = "0";
    });
  };

  const startAnimate = (element: HTMLElement) => {
    const to = {
      transform: "translateY(32px)",
      opacity: 0,
    };
    const from = {
      transform: "translateY(0)",
      opacity: 1,
    };
    const options: KeyframeAnimationOptions = {
      duration: 200,
      fill: "forwards",
    };

    element.animate([to, from], options);
  };

  const renderUnitAndUpdateCurrentTime = (value, unitIndex, minUnitIndex) => {
    const unitElement = elementTimeUnits[unitIndex];
    const minUnitElement = timeElement[unitElement][minUnitIndex];

    minUnitElement.innerHTML = value;
    startAnimate(minUnitElement);

    currentTime[unitIndex][minUnitIndex] = value;
  };

  const getTimeUnitAsArray = (value: number) =>
    formatTimeUnit(value).split("") as [string, string];

  const renderTimeUnit = (value: number, unitIndex: number) => {
    const [secondMinUnit, firstMinUnit] = getTimeUnitAsArray(value);
    const [secondRenderedMinUnit, firstRenderedMinUnit] = currentTime[
      unitIndex
    ];

    if (firstMinUnit !== firstRenderedMinUnit) {
      const FIRST_MIN_UNIT_INDEX = 1;
      renderUnitAndUpdateCurrentTime(
        firstMinUnit,
        unitIndex,
        FIRST_MIN_UNIT_INDEX
      );
    }

    if (secondMinUnit !== secondRenderedMinUnit) {
      const SECOND_MIN_UNIT_INDEX = 0;
      renderUnitAndUpdateCurrentTime(
        secondMinUnit,
        unitIndex,
        SECOND_MIN_UNIT_INDEX
      );
    }
  };

  const renderReadableTime = (currentTime: number, time?: number) => {
    secondsToReadableTime(currentTime).forEach(renderTimeUnit);

    if (progressBarElement) {
      const percentage = (currentTime * 100) / time;
      progressBarElement.style.width = percentage.toFixed(2) + "%";
    }
  };

  return {
    resetRenderedTime,
    renderReadableTime,
  };
};

export default createRenderTime;
