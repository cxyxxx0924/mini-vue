import { createRenderer } from '../runtime-core'

function createElement(type) {
  const el = document.createElement(type);
  return el;
}

function patchProps(el, key, value) {
  const test = /^on[A-Z]/.test(key);
  if (test) {
    el.addEventListener(key.slice(2).toLocaleLowerCase(), value);
  }
  el.setAttribute(key, value);
}

function insert(parent, el) {
  // name
  parent.append(el);
}

const renderer: any = createRenderer({
  createElement, patchProps, insert
})

export function createApp(...args) {
  return renderer.createApp(...args)
}

export * from "../runtime-core/index"
