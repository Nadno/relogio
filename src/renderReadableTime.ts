import { secondsToReadableTime } from "./formatTime";

const createRenderTime = (elementTime: {
  hours: HTMLElement[];
  minutes: HTMLElement[];
  seconds: HTMLElement[];
}) => {
  let hours = ["0", "0"],
    minutes = ["0", "0"],
    seconds = ["0", "0"];
  const currentTime = [hours, minutes, seconds];
  
  const resetRenderCurrentTime = () =>
    currentTime.forEach((unit) => {
      unit[0] = "0";
      unit[1] = "0";
    });

  const setAndRenderTimeUnit = (unitIndex, decimalUnitIndex, value) => {
    const elementTimeUnit = ["hours", "minutes", "seconds"][unitIndex];

    currentTime[unitIndex][decimalUnitIndex] = value;
    elementTime[elementTimeUnit][decimalUnitIndex].innerHTML = value;
  };

  const renderChangedUnits = ([decimalUnitTwo, decimalUnitOne], index) => {
    const [currentUnitTwo, currentUnitOne] = currentTime[index];

    if (decimalUnitOne !== currentUnitOne) {
      setAndRenderTimeUnit(index, 1, decimalUnitOne);
    }

    if (decimalUnitTwo !== currentUnitTwo) {
      setAndRenderTimeUnit(index, 0, decimalUnitTwo);
    }
  };

  const renderReadableTime = (UTCTime) => {
    secondsToReadableTime(UTCTime).forEach(renderChangedUnits);
  };

  return {
    resetRenderCurrentTime,
    renderReadableTime,
  };
};

export default createRenderTime;
