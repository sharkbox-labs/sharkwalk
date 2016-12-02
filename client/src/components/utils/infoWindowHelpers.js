const getDurationDifference = (currentRouteDuration, alternateRouteDuration) => {
  let durationDifference;
  const difference = currentRouteDuration - alternateRouteDuration;
  const description = difference < 0 ? 'slower' : 'faster';
  const absoluteDifference = Math.abs(difference);

  if (absoluteDifference < 60) {
    durationDifference = `${absoluteDifference} sec${(absoluteDifference !== 1 ? 's' : '')} ${description}`;
  } else if (absoluteDifference < 60 * 60) {
    const minutes = Math.floor(absoluteDifference / 60);
    durationDifference = `${minutes}min ${description}`;
  }

  return durationDifference;
};

const getRiskDescription = (risk) => {
  const absoluteRisk = Math.abs(risk);
  const smooth = risk > 5 && risk <= 15 ? 'smoother' : 'smooth';
  const description = risk > 0 ? 'choppy' : `${smooth}`;

  switch (risk) {
    case absoluteRisk <= 5:
      return '<i>Same swell...</i>';

    case absoluteRisk > 5 && absoluteRisk <= 15:
      return `<i>A little ${description}</i> `;

    case absoluteRisk > 15 && absoluteRisk <= 25:
      return `<i>Very ${description}</i>`;

    default:
      return `<i>Hella ${description}</i>`;
  }
};

const displayRiskDifference = (currentRouteAvgRisk, alternateRouteAvgRisk) => {
  // Risk description will be only displayed when the other route is selected so these should be in relation
  // to the other route
  const normalizedRiskDifference = Math.floor(((currentRouteAvgRisk - alternateRouteAvgRisk) / alternateRouteAvgRisk) * 100);

  return getRiskDescription(normalizedRiskDifference);
};

const displayHoursMinutes = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutesLeft = totalMinutes % 60;
  const hoursDescription = hours > 10 ? 's' : '';
  return `<span class='info-window-time'><b>${hours}hr${hoursDescription} ${minutesLeft}min</b></span>`;
};

const displayMiles = meters => (Math.round(meters * 0.000621371));

export default {
  getDurationDifference,
  getRiskDescription,
  displayRiskDifference,
  displayHoursMinutes,
  displayMiles,
}