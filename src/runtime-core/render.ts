import { VNode } from './vnode';
import { isObject } from './../shared/index';
import { createComponmentInstance, setupComponent } from "./component";


export function render(vnode: VNode, container) {
  path(vnode, container)
}

function path(vnode: VNode, container: any) {
  // processElement(vnode, container);
  // processComponent(vnode, container);
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else if (typeof vnode.type === "string") {
    processElement(vnode, container);
  }
}
// 处理element类型
function processElement(vnode: VNode, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: VNode, container) {

  const el = document.createElement(vnode.type);
  // children 分string 和array两种类型
  if (typeof vnode.children === "string") {
    el.textContent = vnode.children;
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(v => {
      path(v, el);
    });
  }

  // props
  // el.setAttribute("id", "root");
  for (const key in vnode.props) {
    const val = vnode.props[key]
    el.setAttribute(key, val);
  }
  container.append(el);
}
// 处理 component类型
function processComponent(initialVNode, container) {
  mountComponent(initialVNode, container);

}

function mountComponent(initialVNode, container) {
  const instance = createComponmentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container: any) {
  const { proxy } = instance;

  const subtree = instance.type.render.call(proxy);
  path(subtree, container)
}


