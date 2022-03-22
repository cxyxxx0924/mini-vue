import { shallowReadonly } from '../reactivity/reactive';
import { initProps } from './compoentProps';
import { ComponentPublicInstance } from './componentPublicInstance';


export function createComponmentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  }

  return instance;
}

export function setupComponent(instance) {
  // TODO 
  initProps(instance, instance.vnode.props);
  // initSlots
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const { setup } = instance.type;
  const _ = instance;
  instance.proxy = new Proxy({_}, ComponentPublicInstance);
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props));
    handleSetupResult(instance, setupResult);
  }

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

