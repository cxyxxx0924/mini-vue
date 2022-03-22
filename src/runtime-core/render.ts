import { shapeFlags } from './../shared/shapeFlags';
import { VNode } from './vnode';
import { createComponmentInstance, setupComponent } from "./component";


export function render(vnode: VNode, container) {
  path(vnode, container)

}

function path(vnode: VNode, container: any) {
  if (vnode.shapeFlags & shapeFlags.COMPONENT) {
    processComponent(vnode, container);
  } else if (vnode.shapeFlags & shapeFlags.ELEMENT) {
    processElement(vnode, container);
  }
}
// 处理element类型
function processElement(vnode: VNode, container: any) {
  
  mountElement(vnode, container);
}

function mountElement(vnode: VNode, container) {

  const el = vnode.el = document.createElement(vnode.type);
  // childrens 分string 和array两种类型
  if (vnode.shapeFlags & shapeFlags.CHILDRENS_TEXT) {
    el.textContent = vnode.childrens;
  } else if (vnode.shapeFlags & shapeFlags.CHILDRENS_ARRAY) {
    vnode.childrens.forEach(v => {
      path(v, el);
    });
  }

  // props
  // el.setAttribute("id", "root");
  
  for (const key in vnode.props) {
    const val = vnode.props[key];
    const test = /^on[A-Z]/.test(key);
    if(test) {
      el.addEventListener(key.slice(2).toLocaleLowerCase(), val);
    }
    el.setAttribute(key, val);
  }
  container.append(el);
}
// 处理 component类型
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: VNode, container) {
  const instance = createComponmentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container: any) {
  const { proxy } = instance;

  const subtree = instance.type.render.call(proxy);
  path(subtree, container);
  vnode.el = subtree.el;
}


