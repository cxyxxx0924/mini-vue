import { hasOwn } from "../shared/index";

const publicPropertiesMap = {
  $el: (i) => {
    return i.vnode.el;
  },
  $slots: (i) => {
    return i.slots;
  },
  $props: (i) => {
    return i.props;
  },
};

export const ComponentPublicInstance = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;

    if (hasOwn(setupState, key)) {
      return setupState[key];
    }
    if (hasOwn(props, key)) {
      return props[key];
    }
    const getterMap = publicPropertiesMap[key];
    if (getterMap) {
      return getterMap(instance);
    }
  },
};
