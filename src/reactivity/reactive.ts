import { mutabelHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandler";

export const enum ReactiveEmuns {
  IS_READONLY = '__v_isReadonly',
  IS_REACTIVE = '__v_isReactivity',
}

export function reactive(raw) {
  return createReactiveObject(raw, mutabelHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}

function createReactiveObject(raw, baseHander) {
  return new Proxy(raw, baseHander);
}

export function isReadonly(observer) {
  return !!observer[ReactiveEmuns.IS_READONLY];
}

export function isReactive(observer) {
  return !!observer[ReactiveEmuns.IS_REACTIVE];
}

export function isProxy(value) {
  return isReadonly(value) || isReactive(value)
}
