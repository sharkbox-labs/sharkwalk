const getDurationDifference = (currentRouteDuration, alternateRouteDuration) => {
  const difference = currentRouteDuration - alternateRouteDuration;
  let absoluteDifference;

  if (Math.abs(difference) > 60) {
    // Get difference in minutes so that it is consistent with the total duration display
    const differenceInMinutes = Math.floor(currentRouteDuration / 60) -
                                Math.floor(alternateRouteDuration / 60);
    absoluteDifference = Math.abs(differenceInMinutes);
  } else {
    absoluteDifference = Math.abs(difference);
  }

  const description = difference > 0 ? 'slower' : 'faster';

  let durationDifference;

  if (Math.abs(difference) < 60) {
    durationDifference = `${absoluteDifference} sec${(absoluteDifference !== 1 ? 's' : '')} ${description}`;
  } else {
    durationDifference = `${absoluteDifference}min ${description}`;
  }

  return durationDifference;
};

const getRiskDescription = (risk) => {
  const absoluteRisk = Math.abs(risk);
  const smooth = risk > 5 && risk <= 15 ? 'smoother' : 'smooth';
  const description = risk > 0 ? 'choppy' : `${smooth}`;

  if (absoluteRisk <= 5) {
    return '<i>Same swell...</i>';
  }

  if (absoluteRisk > 5 && absoluteRisk <= 15) {
    return `<i>A little ${description}</i> `;
  }

  if (absoluteRisk > 15 && absoluteRisk <= 25) {
    return `<i>Very ${description}</i>`;  
  }

  return `<i>Hella ${description}</i>`;
};

const displayRiskDifference = (currentRouteAvgRisk, alternateRouteAvgRisk) => {
  // Risk description will be only displayed when the other route is selected
  // so it will be in relation to the other route
  const normalizedRiskDifference =
    Math.floor(((currentRouteAvgRisk - alternateRouteAvgRisk) / alternateRouteAvgRisk) * 100);

  return getRiskDescription(normalizedRiskDifference);
};

const displayHoursMinutes = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutesLeft = totalMinutes % 60;
  return hours > 0 ? `<span class='info-window-time'><b>${hours}hr ${minutesLeft}min</b></span>` :
                     `<span class='info-window-time'><b>${totalMinutes} min</b></span>`;
};

const displayMiles = meters => (Math.round(meters * 0.000621371));

export default {
  getDurationDifference,
  getRiskDescription,
  displayRiskDifference,
  displayHoursMinutes,
  displayMiles,
};
