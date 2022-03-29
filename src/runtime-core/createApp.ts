import { createVNode } from "./vnode"

export function createAppApi(render) {
  return function createApp(rootComponent) {
    const mount = (rootContainer) => {
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer, null);
    }

    return {
      mount
    }
  }
}



