export const extend = Object.assign;

export const isObject = val => {
  return val !== null && typeof val === "object";
}

export const EMPTY_OBJ = {};

export const hasChange = (val, newVal) => {
  return !Object.is(val, newVal)
}

export const isString = value => {
  return typeof value === "string";
}

export const isArray = value => {
  return Array.isArray(value);
}

export const hasOwn = (states, key) => {
  return Object.prototype.hasOwnProperty.call(states, key);
}

const camelize = (str:string) => {
  // const charAt0 = val.charAt(0).toLocaleUpperCase();
  // return charAt0 + val.slice(1);
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

export const handlerKey = (event: string) => {
  return camelize(event) ? "on" + camelize(event) : "";
} 
