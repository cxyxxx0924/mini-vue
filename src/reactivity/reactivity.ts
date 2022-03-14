import { track, trigger } from "./effect";

export function reactivity(row) {
  // const ret = Reflect
  return new Proxy(row, {
    get(target, key) {
      const ret = Reflect.get(target, key);
      track(target, key);
      return ret;
    },
    set(target, key, value) {
      const ret = Reflect.set(target, key, value);
      trigger(target, key);
      return ret;
    }
  })
}
