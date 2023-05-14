export const filterProperty = (data: Record<string, any>[], filter: Record<string, any>): any[] => {
  return data.filter((obj: any) => {
    for (let key in filter) {
      if (filter[key] == 'false' || filter[key] == 'true') {
        filter[key] = JSON.parse(filter[key]);
      }

      if (obj[key] !== filter[key]) return false;
    }
    return true;
  });
};
