import { secondsToReadableTime } from "./formatTime";

const createRenderTime = (timeElement: {
  readonly hours: ReadonlyArray<HTMLElement>;
  readonly minutes: ReadonlyArray<HTMLElement>;
  readonly seconds: ReadonlyArray<HTMLElement>;
}, progressBarElement?: HTMLElement) => {
  const hours = ["0", "0"],
    minutes = ["0", "0"],
    seconds = ["0", "0"];
  const currentTime = [hours, minutes, seconds];
  const elementTimeUnit = ["hours", "minutes", "seconds"]

  const resetRenderedTime = () => {
    currentTime.forEach((unit, index) => {
      const element = elementTimeUnit[index];
      timeElement[element][0].innerHTML = "0";
      timeElement[element][1].innerHTML = "0";
      
      unit[0] = "0";
      unit[1] = "0";
    });
  };

  const startAnimate = (element: HTMLElement) => {
    element.animate(
      [
        {
          transform: "translateY(32px)",
          opacity: 0,
        },
        {
          transform: "translateY(0)",
          opacity: 1,
        },
      ],
      {
        duration: 200,
        fill: "forwards",
      }
    );
  };

  const setAndRenderTimeUnit = (unitIndex, decimalUnitIndex, value) => {
    const element = elementTimeUnit[unitIndex];

    currentTime[unitIndex][decimalUnitIndex] = value;
    timeElement[element][decimalUnitIndex].innerHTML = value;
    startAnimate(timeElement[element][decimalUnitIndex]);
  };

  const renderChangedUnits = ([decimalUnitTwo, decimalUnitOne], unitIndex) => {
    const [currentUnitTwo, currentUnitOne] = currentTime[unitIndex];

    if (decimalUnitOne !== currentUnitOne) {
      setAndRenderTimeUnit(unitIndex, 1, decimalUnitOne);
    }

    if (decimalUnitTwo !== currentUnitTwo) {
      setAndRenderTimeUnit(unitIndex, 0, decimalUnitTwo);
    }
  };

  const renderReadableTime = (UTCCurrentTime: number, UTCTime?: number) => {
    secondsToReadableTime(UTCCurrentTime).forEach(renderChangedUnits);

    if (UTCTime && progressBarElement) {
      const percentage = (UTCCurrentTime * 100) / UTCTime;
      progressBarElement.style.width = percentage.toFixed(2) + "%";
    }
  };

  return {
    resetRenderedTime,
    renderReadableTime,
  };
};

export default createRenderTime;
