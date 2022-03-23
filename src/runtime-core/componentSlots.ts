import { shapeFlags } from './../shared/shapeFlags';
import { isArray, isObject } from './../shared/index';


export function initSlots(instance, childrens) {
  if(instance.vnode.shapeFlags & shapeFlags.CHILDREN_SLOTS) {
    normalizeObject(childrens, instance.slots)
  }
}

function normalizeObject(childrens, slots) {
  if(isObject(childrens)) {
    for (const key in childrens) {
      const values = childrens[key];
      slots[key] = (params) => normalizeSlots(values(params));
    }
  }
}

function normalizeSlots(values) {
  return isArray(values) ? values : [values];
}