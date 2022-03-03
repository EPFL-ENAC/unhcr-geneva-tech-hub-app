function(keys, values, rereduce) {
  if (rereduce) {
      return values.reduce(function(acc, value){
        acc = acc.concat(value);
        return acc;
      },[]);
  } else {
    return keys.map(function(item) {
      return item[1]
    });
  }
}