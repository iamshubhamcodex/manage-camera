export const kindOf = (obj: unknown, value: string): boolean => {
  return !!(obj && typeof obj === value.toLowerCase());
};
export const filterDataByField = <T>(
  data: T[],
  fields: string | (keyof T)[],
  searchVal: string | number | boolean | object
) => {
  if (searchVal === "" || !searchVal) return data;
  if (typeof searchVal !== "string")
    searchVal = searchVal.toString ? searchVal.toString() : String(searchVal);

  fields = typeof fields === "string" ? (fields.split(",") as (keyof T)[]) : [];
  return data.filter((row) => {
    let bool = false;
    fields.forEach((field) => {
      const value = row[field];
      if (
        value &&
        value.toString().toLowerCase().includes(searchVal.trim().toLowerCase())
      ) {
        bool = true;
      }
    });
    return bool;
  });
};
