const publicPropertiesMap = {
  $el: (i) => {
    return i.vnode.el
  }
}

export const ComponentPublicInstance = {
  get({ _: instance }, key) {
    const { setupState } = instance
    if (key in setupState) {
      return setupState[key]
    } 
    const getterMap = publicPropertiesMap[key];
    if(getterMap) {
      return getterMap(instance);
    }
  }
}