

export function createComponmentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type
  }

  return instance;
}

export function setupComponent(instance) {
  // TODO 
  // initProps
  // initSlots

  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const { setup } = instance.type;
  if (setup) {
    const setupResult = setup();
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
    instance.type.runder = Component.render;
  }
}

