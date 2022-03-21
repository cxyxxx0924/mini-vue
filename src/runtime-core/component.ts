

export function createComponmentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {}
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
  instance.proxy = new Proxy({}, {
    get(target, key) {
      console.log('target', target);
      console.log('key', key);
      const { setupState } = instance
      if (key in setupState) {
        console.log('run here setupState', setupState)
        return setupState[key]
      }
    }
  });
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
    instance.type.render = Component.render;

    // Component.render.call(proxy)
  }
}

