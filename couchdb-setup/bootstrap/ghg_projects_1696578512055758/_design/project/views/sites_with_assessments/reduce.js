function (keys, values, rereduce) {
  if (rereduce) {
    var sites = values.reduce((acc, x) => {acc = acc.concat(x); return acc;}, [])
    var uniqueSites = Object.values(sites.reduce((acc, el) => { acc[el.description] = el; return acc;}, {}))
    return uniqueSites
  } else {
    return values;
  }
}