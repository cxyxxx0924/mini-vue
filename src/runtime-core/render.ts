import { shapeFlags } from './../shared/shapeFlags';
import { FRAGMENT, TEXT, VNode } from './vnode';
import { createComponmentInstance, setupComponent } from "./component";

export function render(vnode: VNode, container) {
  path(vnode, container);
}

function path(vnode: VNode, container: any) {
  switch (vnode.type) {
    case FRAGMENT:
      processFragment(vnode, container);
      break;
    
    case TEXT:
      processText(vnode, container);
      break;
  
    default:
      if (vnode.shapeFlags & shapeFlags.COMPONENT) {
        processComponent(vnode, container);
      } else if (vnode.shapeFlags & shapeFlags.ELEMENT) {
        processElement(vnode, container);
      }
      break;
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
    mountChildren(vnode.childrens, el)
  }
  addEventListener(el, vnode.props);
  container.append(el);
}

function addEventListener(el, props) {
  for (const key in props) {
    const val = props[key];
    const test = /^on[A-Z]/.test(key);
    if (test) {
      el.addEventListener(key.slice(2).toLocaleLowerCase(), val);
    }
    el.setAttribute(key, val);
  }
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

function processFragment(vnode: VNode, container: any) {
  mountChildren(vnode.childrens, container);
}

function mountChildren(childrens, container) {
  childrens.forEach(v => {
    path(v, container);
  });
}



function processText(vnode, container: any) {
  // container.append()
  const el = vnode.el = document.createTextNode(vnode.childrens);
  container.append(el)
}

