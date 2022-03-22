'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var shapeFlags;
(function (shapeFlags) {
    shapeFlags[shapeFlags["ELEMENT"] = 1] = "ELEMENT";
    shapeFlags[shapeFlags["COMPONENT"] = 2] = "COMPONENT";
    shapeFlags[shapeFlags["CHILDRENS_TEXT"] = 4] = "CHILDRENS_TEXT";
    shapeFlags[shapeFlags["CHILDRENS_ARRAY"] = 8] = "CHILDRENS_ARRAY";
})(shapeFlags || (shapeFlags = {}));

const publicPropertiesMap = {
    $el: (i) => {
        return i.vnode.el;
    }
};
const ComponentPublicInstance = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const getterMap = publicPropertiesMap[key];
        if (getterMap) {
            return getterMap(instance);
        }
    }
};

function createComponmentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type,
        setupState: {}
    };
    return instance;
}
function setupComponent(instance) {
    // TODO 
    // initProps
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const { setup } = instance.type;
    const _ = instance;
    instance.proxy = new Proxy({ _ }, ComponentPublicInstance);
    if (setup) {
        const setupResult = setup();
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

const isObject = val => {
    return val !== null && typeof val === "object";
};
const isString = value => {
    return typeof value === "string";
};
const isArray = value => {
    return Array.isArray(value);
};

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

exports.createApp = createApp;
exports.h = h;
