import { track, trigger } from "./effect";
import { reactive, ReactiveEmuns, readonly } from "./reactive";

function createGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(target, key) {
    const ret = Reflect.get(target, key);
    if(isShallowReadonly) {
      return ret;
    }
    if(isObect(ret)) {
      return isReadonly ? readonly(ret) : reactive(ret);
    }
    if (!isReadonly) {
      track(target, key);
    }
    return ret;
  }
}

function createSetter() {
  return function set(target, key, value) {
    const ret = Reflect.set(target, key, value);
      trigger(target, key);
      return ret;
  }
}

function isObect(val) {
  return val !== null && typeof val === "object";
}

export function mutabelHandlers(raw) {
  raw[ReactiveEmuns.IS_REACTIVE] = true;
  return new Proxy(raw, {
    get,
    set
  })
}

export function readonlyHandlers(raw) {
  raw[ReactiveEmuns.IS_READONLY] = true;
  return new Proxy(raw, {
    get: readonlyGet,
    set(target, key: string) {
      console.warn(`修改${key}失败，因为${target}是readonly不可以支持修改`);
      return true;
    }
  })
}

export function shallowReadonlyHandlers(raw) {
  raw[ReactiveEmuns.IS_READONLY] = true;
  return new Proxy(raw, {
    get: shallowReadonlyGet,
    set(target, key: string) {
      console.warn(`修改${key}失败，因为${target}是readonly不可以支持修改`);
      return true;
    }
  })
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

