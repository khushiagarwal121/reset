export default (obj) => {
  const minutes = ["00", "15", "30", "45"];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 4; j++) {
      if (i == 0) {
        obj.push(`12:${minutes[j]} AM`.padStart(8, "0"));
      }
      else if (i < 12) {
        obj.push(`${i}:${minutes[j]} AM`.padStart(8, "0"));
      } else if (i == 12) {
        obj.push(`12:${minutes[j]} PM`.padStart(8, "0"));
      } else {
        obj.push(`${i - 12}:${minutes[j]} PM`.padStart(8, "0"));
      }
    }
  }
};
