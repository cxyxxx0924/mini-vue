import { createComponmentInstance, setupComponent } from "./component";


export function render(vnode, container) {
  path(vnode, container)
}

function path(vnode: any, container: any) {
  // processElement(vnode, container);
  // processComponent(vnode, container);
  if (typeof vnode.type === "object") {
    processComponent(vnode, container);
  } else if (typeof vnode.type === "string") {
    processElement(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  
}


function processComponent(vnode, container) {
  mountComponent(vnode, container);

}

function mountComponent(vnode, container) {
  const instance = createComponmentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container)

}

function setupRenderEffect(instance, container: any) {
  const subtree = instance.type.render();

  path(subtree, container)
}


