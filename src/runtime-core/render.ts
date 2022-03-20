import { createComponmentInstance, setupComponent } from "./component";


export function render(vnode, container) {
  path(vnode, container)
}

function path(vnode: any, container: any) {
  processComponent(vnode, container);
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
  const subtree = instance.render();

  path(subtree, container)
}

