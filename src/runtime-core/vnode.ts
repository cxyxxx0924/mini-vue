import { shapeFlags } from './../shared/shapeFlags';
import { isObject, isString, isArray } from './../shared/index';

export const FRAGMENT = Symbol("FRAGMENT");
export const TEXT = Symbol("TEXT");

export function createVNode(type, props?, childrens?): VNode {

  const vnode: VNode = {
    type,
    props,
    childrens,
    shapeFlags: 0,
  }

  if (isObject(type)) {
    vnode.shapeFlags |= shapeFlags.COMPONENT;
  } else if (isString(type)) {
    vnode.shapeFlags |= shapeFlags.ELEMENT;
  }

  if (isString(childrens)) {
    vnode.shapeFlags |= shapeFlags.CHILDRENS_TEXT;
  } else if (isArray(childrens)) {
    vnode.shapeFlags |= shapeFlags.CHILDRENS_ARRAY;
  }
  // slots 必须是一个components && childrens必须为object
  if (vnode.shapeFlags & shapeFlags.COMPONENT) {
    if (isObject(childrens)) {
      vnode.shapeFlags |= shapeFlags.CHILDREN_SLOTS;
    }
  }
  return vnode;
}

export function createTextVNode(text) {
  const textVNode = {
    type: TEXT, props: {}, childrens: text, 
  }

  return textVNode;
}

export type VNode = {
  type: any,
  props: any,
  childrens: any,
  el?: any,
  shapeFlags: number,
}