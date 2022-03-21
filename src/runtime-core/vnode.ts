export function createVNode(type, props?, children?): VNode {

  const vnode: VNode = {
    type,
    props,
    children
  }

  return vnode;
}

export type VNode = {
  type: any,
  props: any,
  children: any,
  el?: any
}