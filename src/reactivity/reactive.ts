import { mutabelHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandler";

export const enum ReactiveEmuns {
  IS_READONLY = '__v_isReadonly',
  IS_REACTIVE = '__v_isReactivity',
  IS_SHALLOW_READONLY = '__v_is_shallowReadonly',
}

export function reactive(raw) {
  return createReactiveObject(raw, mutabelHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject(raw, baseHander) {
  return baseHander(raw);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
  
}

export function isReadonly(observer) {
  return !!observer[ReactiveEmuns.IS_READONLY];
}

export function isReactive(observer) {
  return !!observer[ReactiveEmuns.IS_REACTIVE];

}
