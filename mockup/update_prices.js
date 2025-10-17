// Calculate 20% higher prices
const prices = {
  "190.97": (190.97 * 1.2).toFixed(2),
  "212.19": (212.19 * 1.2).toFixed(2),
  "271.25": (271.25 * 1.2).toFixed(2),
  "324.48": (324.48 * 1.2).toFixed(2),
  "361.09": (361.09 * 1.2).toFixed(2),
  "226.35": (226.35 * 1.2).toFixed(2),
  "251.50": (251.50 * 1.2).toFixed(2),
  "173.73": (173.73 * 1.2).toFixed(2),
  "193.04": (193.04 * 1.2).toFixed(2),
  "260.92": (260.92 * 1.2).toFixed(2),
  "289.93": (289.93 * 1.2).toFixed(2)
};
console.log(JSON.stringify(prices, null, 2));
