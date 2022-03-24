var shapeFlags;
(function (shapeFlags) {
    shapeFlags[shapeFlags["ELEMENT"] = 1] = "ELEMENT";
    shapeFlags[shapeFlags["COMPONENT"] = 2] = "COMPONENT";
    shapeFlags[shapeFlags["CHILDRENS_TEXT"] = 4] = "CHILDRENS_TEXT";
    shapeFlags[shapeFlags["CHILDRENS_ARRAY"] = 8] = "CHILDRENS_ARRAY";
    shapeFlags[shapeFlags["CHILDREN_SLOTS"] = 16] = "CHILDREN_SLOTS";
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

const FRAGMENT = Symbol("FRAGMENT");
const TEXT = Symbol("TEXT");
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
    // slots 必须是一个components && childrens必须为object
    if (vnode.shapeFlags & shapeFlags.COMPONENT) {
        if (isObject(childrens)) {
            vnode.shapeFlags |= shapeFlags.CHILDREN_SLOTS;
        }
    }
    return vnode;
}
function createTextVNode(text) {
    const textVNode = {
        type: TEXT, props: {}, childrens: text,
    };
    return textVNode;
}

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
    $el: i => {
        return i.vnode.el;
    },
    $slots: i => {
        return i.slots;
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

function initSlots(instance, childrens) {
    if (instance.vnode.shapeFlags & shapeFlags.CHILDREN_SLOTS) {
        normalizeObject(childrens, instance.slots);
    }
}
function normalizeObject(childrens, slots) {
    if (isObject(childrens)) {
        for (const key in childrens) {
            const values = childrens[key];
            slots[key] = (params) => normalizeSlots(values(params));
        }
    }
}
function normalizeSlots(values) {
    return isArray(values) ? values : [values];
}

function createComponmentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => { },
        slots: {},
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.childrens);
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
    switch (vnode.type) {
        case FRAGMENT:
            processFragment(vnode, container);
            break;
        case TEXT:
            processText(vnode, container);
            break;
        default:
            if (vnode.shapeFlags & shapeFlags.COMPONENT) {
                processComponent(vnode, container);
            }
            else if (vnode.shapeFlags & shapeFlags.ELEMENT) {
                processElement(vnode, container);
            }
            break;
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
        mountChildren(vnode.childrens, el);
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
function processFragment(vnode, container) {
    mountChildren(vnode.childrens, container);
}
function mountChildren(childrens, container) {
    childrens.forEach(v => {
        path(v, container);
    });
}
function processText(vnode, container) {
    // container.append()
    const el = vnode.el = document.createTextNode(vnode.childrens);
    container.append(el);
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

function renderSlots(slots, key, params) {
    const slot = slots[key];
    if (typeof slot === 'function') {
        return createVNode(FRAGMENT, {}, slot(params));
    }
}

export { createApp, createTextVNode, h, renderSlots };
