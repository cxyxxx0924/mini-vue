import { shapeFlags } from './../shared/shapeFlags';
import { FRAGMENT, TEXT, VNode } from './vnode';
import { createComponmentInstance, setupComponent } from "./component";

export function render(vnode: VNode, container, parentInstance) {
  path(vnode, container, parentInstance);
}

function path(vnode: VNode, container: any, parentInstance) {
  switch (vnode.type) {
    case FRAGMENT:
      processFragment(vnode, container, parentInstance);
      break;
    
    case TEXT:
      processText(vnode, container);
      break;
  
    default:
      if (vnode.shapeFlags & shapeFlags.COMPONENT) {
        processComponent(vnode, container, parentInstance);
      } else if (vnode.shapeFlags & shapeFlags.ELEMENT) {
        processElement(vnode, container, parentInstance);
      }
      break;
  }
  
}
// 处理element类型
function processElement(vnode: VNode, container: any, parentInstance) {
  mountElement(vnode, container, parentInstance);
}

function mountElement(vnode: VNode, container, parentInstance) {
  const el = vnode.el = document.createElement(vnode.type);
  // childrens 分string 和array两种类型
  if (vnode.shapeFlags & shapeFlags.CHILDRENS_TEXT) {
    el.textContent = vnode.childrens;
  } else if (vnode.shapeFlags & shapeFlags.CHILDRENS_ARRAY) {
    mountChildren(vnode.childrens, el, parentInstance)
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
function processComponent(vnode, container, parentInstance) {
  mountComponent(vnode, container, parentInstance);
}

function mountComponent(vnode: VNode, container, parentInstance) {
  const instance = createComponmentInstance(vnode, parentInstance);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container: any) {
  const { proxy } = instance;

  const subtree = instance.type.render.call(proxy);
  path(subtree, container, instance);
  vnode.el = subtree.el;
}

function processFragment(vnode: VNode, container: any, parentInstance) {
  mountChildren(vnode.childrens, container, parentInstance);
}

function mountChildren(childrens, container, parentInstance) {
  childrens.forEach(v => {
    path(v, container, parentInstance);
  });
}



function processText(vnode, container: any) {
  // container.append()
  const el = vnode.el = document.createTextNode(vnode.childrens);
  container.append(el)
}

