// get array of id and name from an array of objects
export const getArrayOfIdAndName = (objects, key, name) => {
  return objects.reduce((acc, item) => {
    if (!acc.some((cat) => cat.id === item[key])) {
      acc.push({ id: item[key], name: item[name] });
    }
    acc.sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, []);
};

// products.reduce((acc, item) => {
//     if (!acc.some((cat) => cat.id === item.category_id)) {
//       acc.push({ id: item.category_id, name: item.category });
//     }
//     return acc;
//   }, []);
