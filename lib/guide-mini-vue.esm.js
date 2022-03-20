const isObject = (val) => {
    return val !== null && typeof val === "object";
};

function createComponmentInstance(vnode) {
    const instance = {
        vnode,
        type: vnode.type
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
        instance.type.runder = Component.render;
    }
}

function render(vnode, container) {
    path(vnode, container);
}
function path(vnode, container) {
    // processElement(vnode, container);
    // processComponent(vnode, container);
    if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
    else if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type);
    // children 分string 和array两种类型
    if (typeof vnode.children === "string") {
        el.textContent = vnode.children;
    }
    else if (Array.isArray(vnode.children)) {
        vnode.children.forEach(v => {
            path(v, el);
        });
    }
    // props
    // el.setAttribute("id", "root");
    for (const key in vnode.props) {
        const val = vnode.props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponmentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subtree = instance.type.render();
    path(subtree, container);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
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

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
