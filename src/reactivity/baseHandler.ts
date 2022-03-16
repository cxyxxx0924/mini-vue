import { track, trigger } from "./effect";
import { reactive, ReactiveEmuns, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, isShallowReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveEmuns.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveEmuns.IS_READONLY) {
      return isReadonly;
    }
    const ret = Reflect.get(target, key);
    if (isShallowReadonly) {
      return ret;
    }
    if (isObect(ret)) {
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

export const mutabelHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key: string) {
    console.warn(`修改${key}失败，因为${target}是readonly不可以支持修改`);
    return true;
  }
}

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key: string) {
    console.warn(`修改${key}失败，因为${target}是readonly不可以支持修改`);
    return true;
  }
};


