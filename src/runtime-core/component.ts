import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { ComponentPublicInstance } from './componentPublicInstance';
import { initSlots } from './componentSlots';

let currentInstance;
export function createComponmentInstance(vnode, parentInstance) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => { },
    slots: {},
    // provides: parentInstance ? parentInstance.provides : {},
    provides: {},
    parent: parentInstance,
  }
  component.provides = component.parent ? Object.create(component.parent.provides) : {};
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.childrens);
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const { setup } = instance.type;
  const _ = instance;
  instance.proxy = new Proxy({ _ }, ComponentPublicInstance);
  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
    handleSetupResult(instance, setupResult);
  }
  setCurrentInstance(null);
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance)

}

function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.type.render = Component.render;
  }
}

export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance) {
  currentInstance = instance;
}
