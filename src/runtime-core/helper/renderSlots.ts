import { createVNode, FRAGMENT } from "../vnode";

export function renderSlots(slots, key, params) {
  const slot = slots[key];
  if(typeof slot === 'function') {
    return createVNode(FRAGMENT, {}, slot(params));
  }
}