export const countDuplicate = (arr: any[], property: any): number => {
  const hashmap = {};
  const duplicates = [];

  for (let obj of arr) {
    const value = obj[property];
    if (hashmap[value]) {
      duplicates.push(value);
    }
    hashmap[value] = true;
  }

  return duplicates.length;
};
