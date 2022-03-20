import { render } from "./render"
import { createVNode } from "./vnode"

export function createApp(rootComponent) {
  const mount = (rootContainer) => {
    const vnode = createVNode(rootComponent)
    render(vnode, rootContainer)
  }

  return {
    mount
  }
}


