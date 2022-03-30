import { createRenderer } from '../runtime-core'

function createElement(type) {

  const el = document.createElement(type);
  return el;
}

function patchProps(el, key, oldVal, nextVal) {
  if (oldVal !== nextVal) {
    const test = /^on[A-Z]/.test(key);
    if (test) {
      el.addEventListener(key.slice(2).toLocaleLowerCase(), nextVal);
    }
    if (nextVal === null || nextVal === undefined) {
      // el.reAttribute(key, nextVal);
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextVal);
    }
  }
}

function insert(parent, el) {

  // name
  parent.append(el);
}

function remove(children) {
  const parentVNode = children.parentNode;
  if(parentVNode) {
    parentVNode.removeChild(children)
  }
}

function setElementText(el, text) {
  console.log('text', text);
  
  el.textContent = text;
}

const renderer: any = createRenderer({
  createElement, patchProps, insert, remove, setElementText
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from "../runtime-core/index"
