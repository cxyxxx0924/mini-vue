export const extend = Object.assign;

export const isObject = val => {
  return val !== null && typeof val === "object";
}

export const hasChange = (val, newVal) => {
  return !Object.is(val, newVal)
}

export const isString = value => {
  return typeof value === "string";
}

export const isArray = value => {
  return Array.isArray(value);

}