export const formatTimeUnit = (value) => `0${Number.parseInt(value, 10)}`.slice(-2);

export const secondsToReadableTime = (secondsUTC: number): string => {
  const hours = Math.floor(secondsUTC / 60 / 60);
  const minutes = Math.floor(secondsUTC / 60 - hours * 60);
  const seconds = secondsUTC % 60;

  return [hours, minutes, seconds].map(formatTimeUnit).join(":");
};

export const hoursToSeconds = (hours: number | string): number =>
  Number(hours) * 60 * 60;

export const minutesToSeconds = (minutes: number | string): number =>
  Number(minutes) * 60;

export const readableTimeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(":");
  const secondsUTC =
    hoursToSeconds(hours) + minutesToSeconds(minutes) + Number(seconds);

  return secondsUTC;
};
