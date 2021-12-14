export function sumGrouping(data) {
  const tmp = {};

  data.forEach((item) => {
    const tempKey = item.zone;
    if (!tmp.hasOwnProperty(tempKey)) {
      tmp[tempKey] = item;
    } else {
      const val = tmp[tempKey];
      val.total += item.total;
      val.weekly_fee += item.weekly_fee;
    }
  });

  return Object.keys(tmp).map((key) => tmp[key]);
}
