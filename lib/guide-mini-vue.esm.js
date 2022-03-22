var shapeFlags;
(function (shapeFlags) {
    shapeFlags[shapeFlags["ELEMENT"] = 1] = "ELEMENT";
    shapeFlags[shapeFlags["COMPONENT"] = 2] = "COMPONENT";
    shapeFlags[shapeFlags["CHILDRENS_TEXT"] = 4] = "CHILDRENS_TEXT";
    shapeFlags[shapeFlags["CHILDRENS_ARRAY"] = 8] = "CHILDRENS_ARRAY";
})(shapeFlags || (shapeFlags = {}));

const isObject = val => {
    return val !== null && typeof val === "object";
};
const isString = value => {
    return typeof value === "string";
};
const isArray = value => {
    return Array.isArray(value);
};
const hasOwn = (states, key) => {
    return Object.prototype.hasOwnProperty.call(states, key);
};
const camelize = (str) => {
    // const charAt0 = val.charAt(0).toLocaleUpperCase();
    // return charAt0 + val.slice(1);
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
};
const handlerKey = (event) => {
    return camelize(event) ? "on" + camelize(event) : "";
};

let targetMap = new Map();
// 触发依赖
// 主要触发effect中的run方法，去触发effect
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    triggerEffect(dep);
}
function triggerEffect(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallowReadonly = false) {
    return function get(target, key) {
        if (key === "__v_isReactivity" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        const ret = Reflect.get(target, key);
        if (isShallowReadonly) {
            return ret;
        }
        if (isObject(ret)) {
            return isReadonly ? readonly(ret) : reactive(ret);
        }
        return ret;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const ret = Reflect.set(target, key, value);
        trigger(target, key);
        return ret;
    };
}
const mutabelHandlers = {
    get,
    set
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        console.warn(`修改${key}失败，因为${target}是readonly不可以支持修改`);
        return true;
    }
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set(target, key) {
        console.warn(`修改${key}失败，因为${target}是readonly不可以支持修改`);
        return true;
    }
};

function reactive(raw) {
    return createReactiveObject(raw, mutabelHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function createReactiveObject(raw, baseHander) {
    return new Proxy(raw, baseHander);
}

const emit = (instance, event, ...args) => {
    const { props } = instance;
    const handlerName = props[handlerKey(event)];
    handlerName && handlerName(...args);
};

function initProps(instance, rawProps) {
    // instance.props = rawProps;
    instance.props = rawProps || {};
}

const publicPropertiesMap = {
    $el: (i) => {
        return i.vnode.el;
    }
};
const ComponentPublicInstance = {
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
    }
};

function createComponmentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { },
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO 
    initProps(instance, instance.vnode.props);
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    const _ = instance;
    instance.proxy = new Proxy({ _ }, ComponentPublicInstance);
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.type.render = Component.render;
    }
}

function render(vnode, container) {
    path(vnode, container);
}
function path(vnode, container) {
    if (vnode.shapeFlags & shapeFlags.COMPONENT) {
        processComponent(vnode, container);
    }
    else if (vnode.shapeFlags & shapeFlags.ELEMENT) {
        processElement(vnode, container);
    }
}
// 处理element类型
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = vnode.el = document.createElement(vnode.type);
    // childrens 分string 和array两种类型
    if (vnode.shapeFlags & shapeFlags.CHILDRENS_TEXT) {
        el.textContent = vnode.childrens;
    }
    else if (vnode.shapeFlags & shapeFlags.CHILDRENS_ARRAY) {
        vnode.childrens.forEach(v => {
            path(v, el);
        });
    }
    // props
    // el.setAttribute("id", "root");
    for (const key in vnode.props) {
        const val = vnode.props[key];
        const test = /^on[A-Z]/.test(key);
        if (test) {
            el.addEventListener(key.slice(2).toLocaleLowerCase(), val);
        }
        el.setAttribute(key, val);
    }
    container.append(el);
}
// 处理 component类型
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponmentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subtree = instance.type.render.call(proxy);
    path(subtree, container);
    vnode.el = subtree.el;
}

function createVNode(type, props, childrens) {
    const vnode = {
        type,
        props,
        childrens,
        shapeFlags: 0,
    };
    if (isObject(type)) {
        vnode.shapeFlags |= shapeFlags.COMPONENT;
    }
    else if (isString(type)) {
        vnode.shapeFlags |= shapeFlags.ELEMENT;
    }
    if (isString(childrens)) {
        vnode.shapeFlags |= shapeFlags.CHILDRENS_TEXT;
    }
    else if (isArray(childrens)) {
        vnode.shapeFlags |= shapeFlags.CHILDRENS_ARRAY;
    }
    return vnode;
}

function createApp(rootComponent) {
    const mount = (rootContainer) => {
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
    };
    return {
        mount
    };
}

function h(type, props, childrens) {
    return createVNode(type, props, childrens);
}

export { createApp, h };
