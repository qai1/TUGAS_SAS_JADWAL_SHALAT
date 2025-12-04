export const getCurrentIcon = () => {
  const hour = new Date().getHours();

  if (hour >= 4 && hour < 7) return require("../assets/images/sunrise.png");
  if (hour >= 7 && hour < 15) return require("../assets/images/day.png");
  if (hour >= 15 && hour < 18) return require("../assets/images/afternoon.png");
  if (hour >= 18 || hour < 4) return require("../assets/images/night.png");

  return require("../assets/images/day.png");
};
