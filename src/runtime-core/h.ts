import {createVNode} from './vnode';

export function h(type, props?, childrens?) {
  return createVNode(type, props, childrens)
}