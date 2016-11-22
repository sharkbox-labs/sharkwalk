const precisionRound = function precisionRound(number, precision) {
  const factor = Math.pow(10, precision); // eslint-disable-line no-restricted-properties
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

/**
 * Takes an array or risks and returns a complete route
 * profile.
 * @param  {number[]} risks An array of risk values.
 * @return {Object}       The route profile. The object will have keys
 * `risks`, which corresponds to the input `risks`; `maxRisk`, which is
 * the maxiumum risk value; `averageRisk`, the risk averaged over the route;
 * and `totalRisk`, the total value of the route.
 */
const profileRoute = function profileRoute(risks) {
  const result = {};
  result.risks = risks;
  result.totalRisk = precisionRound(risks.reduce((tot, risk) => risk + tot), 2);
  result.maxRisk = precisionRound(Math.max(...risks), 2);
  result.averageRisk = precisionRound(result.totalRisk / risks.length, 2);
  return result;
};

module.exports = {
  profileRoute,
};
