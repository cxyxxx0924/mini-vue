import { shapeFlags } from './../shared/shapeFlags';
import { isObject, isString, isArray } from './../shared/index';
export function createVNode(type, props?, childrens?): VNode {

  const vnode: VNode = {
    type,
    props,
    childrens,
    shapeFlags: 0,
  }
  
  if(isObject(type)) {
    vnode.shapeFlags |= shapeFlags.COMPONENT;
  } else if(isString(type)) {
    vnode.shapeFlags |= shapeFlags.ELEMENT;
  }

  if(isString(childrens)) {
    vnode.shapeFlags |= shapeFlags.CHILDRENS_TEXT;
  } else if(isArray(childrens)) {
    vnode.shapeFlags |= shapeFlags.CHILDRENS_ARRAY;
  }

  return vnode;
}

export type VNode = {
  type: any,
  props: any,
  childrens: any,
  el?: any,
  shapeFlags: number
}