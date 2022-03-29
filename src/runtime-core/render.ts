import { shapeFlags } from './../shared/shapeFlags';
import { FRAGMENT, TEXT, VNode } from './vnode';
import { createComponmentInstance, setupComponent } from "./component";
import { createAppApi } from './createApp';
import { effect } from '../reactivity/effect';
import { EMPTY_OBJ } from '../shared';

export function createRenderer(options) {
  const { createElement: hostCreateElement, insert: hostInsert, patchProps: hostPatchProps } = options;

  function render(n2: VNode, container, parentInstance) {
    path(null, n2, container, parentInstance);
  }

  function path(n1, n2: VNode, container: any, parentInstance) {
    switch (n2.type) {
      case FRAGMENT:
        processFragment(n1, n2, container, parentInstance);
        break;

      case TEXT:
        processText(n1, n2, container);
        break;

      default:
        if (n2.shapeFlags & shapeFlags.COMPONENT) {
          processComponent(n1, n2, container, parentInstance);
        } else if (n2.shapeFlags & shapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentInstance);
        }
        break;
    }

  }
  // 处理element类型
  function processElement(n1, n2: VNode, container: any, parentInstance) {
    if (!n1) {
      mountElement(n1, n2, container, parentInstance);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    console.log('patchElement');

    console.log('n1', n1);
    console.log('n2', n2);
    const el = (n2.el = n1.el);
    const prevProps = n1.props;
    const nextProps = n2.props;

    patchProps(el, prevProps, nextProps);
  }

  function patchProps(el, oldProps, newProps) {

    for (const key in newProps) {
      const oldProp = oldProps[key];
      const nextProp = newProps[key];
      if (nextProp !== oldProp) {
        hostPatchProps(el, key, oldProp, nextProp)
      }
    }
    if(oldProps !== EMPTY_OBJ) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProps(el, key, oldProps[key], null)
        }
      }
    }
  }

  function mountElement(n1, n2: VNode, container, parentInstance) {
    // const el = vnode.el = document.createElement(vnode.type);
    const el = (n2.el = hostCreateElement(n2.type))
    // childrens 分string 和array两种类型
    if (n2.shapeFlags & shapeFlags.CHILDRENS_TEXT) {
      el.textContent = n2.childrens;
    } else if (n2.shapeFlags & shapeFlags.CHILDRENS_ARRAY) {
      mountChildren(n2.childrens, el, parentInstance)
    }
    addEventListener(el, n2.props);
    // container.append(el);
    hostInsert(container, el)

  }

  function addEventListener(el, props) {
    for (const key in props) {
      const value = props[key]
      hostPatchProps(el, key, null, value);
    }
  }

  // 处理 component类型
  function processComponent(n1, n2, container, parentInstance) {
    mountComponent(n1, n2, container, parentInstance);
  }

  function mountComponent(n1, n2: VNode, container, parentInstance) {
    const instance = createComponmentInstance(n2, parentInstance);

    setupComponent(instance);
    setupRenderEffect(instance, n1, n2, container)
  }

  function setupRenderEffect(instance, n1, n2, container: any) {
    effect(() => {

      if (!instance.isMounted) {
        const { proxy } = instance;
        const subtree = instance.type.render.call(proxy);
        console.log("init");
        instance.prevSubtree = subtree;
        n2.el = subtree.el;
        path(null, subtree, container, instance);
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subtree = instance.type.render.call(proxy);
        console.log("update");
        const prevSubtree = instance.prevSubtree
        instance.prevSubtree = subtree;
        path(prevSubtree, subtree, container, instance);
      }
    })
  }

  function processFragment(n1, n2: VNode, container: any, parentInstance) {
    mountChildren(n2.childrens, container, parentInstance);
  }

  function mountChildren(childrens, container, parentInstance) {
    childrens.forEach(v => {
      path(null, v, container, parentInstance);
    });
  }

  function processText(n1, n2, container: any) {
    // container.append()
    const el = n2.el = document.createTextNode(n2.childrens);
    container.append(el)
  }

  return {
    createApp: createAppApi(render)
  }

}
