import { shapeFlags } from './../shared/shapeFlags';
import { FRAGMENT, TEXT, VNode } from './vnode';
import { createComponmentInstance, setupComponent } from "./component";
import { createAppApi } from './createApp';
import { effect } from '../reactivity/effect';
import { EMPTY_OBJ } from '../shared';

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProps: hostPatchProps,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options;

  function render(n2: VNode, container, parentInstance) {
    path(null, n2, container, parentInstance, null);
  }

  function path(n1, n2: VNode, container: any, parentInstance, anchor) {
    switch (n2.type) {
      case FRAGMENT:
        processFragment(n1, n2, container, parentInstance, anchor);
        break;

      case TEXT:
        processText(n1, n2, container);
        break;

      default:
        if (n2.shapeFlags & shapeFlags.COMPONENT) {
          processComponent(n1, n2, container, parentInstance, anchor);
        } else if (n2.shapeFlags & shapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentInstance, anchor);
        }
        break;
    }

  }
  // 处理element类型
  function processElement(n1, n2: VNode, container: any, parentInstance, anchor) {
    if (!n1) {
      mountElement(n1, n2, container, parentInstance, anchor);
    } else {
      patchElement(n1, n2, container, parentInstance, anchor);
    }
  }

  function patchElement(n1, n2, container, parentInstance, anchor) {

    const el = (n2.el = n1.el);


    patchProps(el, n1, n1);
    patchChildrens(n1, n2, el, parentInstance, anchor);
  }

  function patchProps(el, n1, n2) {
    const prevProps = n1.props;
    const nextProps = n2.props;
    for (const key in nextProps) {
      const oldProp = prevProps[key];
      const nextProp = nextProps[key];
      if (nextProp !== oldProp) {
        hostPatchProps(el, key, oldProp, nextProp)
      }
    }
    if (prevProps !== EMPTY_OBJ) {
      for (const key in prevProps) {
        if (!(key in nextProps)) {
          hostPatchProps(el, key, prevProps[key], null)
        }
      }
    }
  }

  function patchChildrens(n1, n2, container, parentInstance, anchor) {
    const newShapeFlage = n2.shapeFlags;
    const oldShapeFlage = n1.shapeFlags;
    const c1 = n1.childrens;
    const c2 = n2.childrens;
    if (newShapeFlage & shapeFlags.CHILDRENS_TEXT) {
      if (oldShapeFlage & shapeFlags.CHILDRENS_ARRAY) {
        // 新的是文本，老的是数组
        unmountChildrens(c1);
      }
      if (c1 !== c2) {
        // 新老节点的children不相同时
        hostSetElementText(container, c2);
      }
    } else {
      // 新的是数组，老的是文本
      if (oldShapeFlage & shapeFlags.CHILDRENS_TEXT) {
        hostSetElementText(container, "");
        mountChildren(c2, container, parentInstance, anchor)
      } else {
        // 新的老的都是数组
        patchKeyedChildren(c1, c2, container, parentInstance);

      }
    }

    // console.log('n1', n1);
    // console.log('n2', n2);
  }

  function patchKeyedChildren(c1, c2, container, parentInstance) {

    const l2 = c2.length;

    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    let i = 0;

    // 判断节点是否相同
    function isSomeVNodeType(n1, n2) {
      // if(n1.key === n2.key) 
      return n1.key === n2.key && n1.type === n2.type;
    }

    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSomeVNodeType(n1, n2)) {
        path(n1, n2, container, parentInstance, null)
      } else {
        break;
      }
      i++;
    }
    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSomeVNodeType(n1, n2)) {
        path(n1, n2, container, parentInstance, null)
      } else {
        break;
      }
      e1--;
      e2--;
    }
    // 新的比老的长
    // (a b)
    // (a b) c
    if (i > e1) {
      if (i <= e2) {
        debugger;
        const nextPos = e2 + 1;
        const anchor = e2 + 1 < l2 ? c2[nextPos].el : null;
        while (i <= e2) {
          path(null, c2[i], container, parentInstance, anchor);
          i++;
        }
      }
    } else if (i <= e1) {
      if (i > e2) {
        while(i <= e1) {
          hostRemove(c1[i].el);
          i++;
        }
      }
    }

  }

  function unmountChildrens(childrens) {
    for (let i = 0; i < childrens.length; i++) {
      const el = childrens[i].el;
      hostRemove(el);
    }

  }

  function mountElement(n1, n2: VNode, container, parentInstance, anchor) {
    // const el = vnode.el = document.createElement(vnode.type);
    const el = (n2.el = hostCreateElement(n2.type))
    // childrens 分string 和array两种类型
    if (n2.shapeFlags & shapeFlags.CHILDRENS_TEXT) {
      el.textContent = n2.childrens;
    } else if (n2.shapeFlags & shapeFlags.CHILDRENS_ARRAY) {
      mountChildren(n2.childrens, el, parentInstance, anchor)
    }
    addEventListener(el, n2.props);
    // container.append(el);
    hostInsert(container, el, anchor);

  }

  function addEventListener(el, props) {
    for (const key in props) {
      const value = props[key]
      hostPatchProps(el, key, null, value);
    }
  }

  // 处理 component类型
  function processComponent(n1, n2, container, parentInstance, anchor) {
    mountComponent(n1, n2, container, parentInstance, anchor);
  }

  function mountComponent(n1, n2: VNode, container, parentInstance, anchor) {
    const instance = createComponmentInstance(n2, parentInstance);

    setupComponent(instance);
    setupRenderEffect(instance, n1, n2, container, anchor)
  }

  function setupRenderEffect(instance, n1, n2, container: any, anchor) {
    effect(() => {

      if (!instance.isMounted) {
        const { proxy } = instance;
        const subtree = instance.type.render.call(proxy);
        console.log("init");
        instance.prevSubtree = subtree;
        n2.el = subtree.el;
        path(null, subtree, container, instance, anchor);
        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subtree = instance.type.render.call(proxy);
        console.log("update");
        const prevSubtree = instance.prevSubtree
        instance.prevSubtree = subtree;
        path(prevSubtree, subtree, container, instance, anchor);
      }
    })
  }

  function processFragment(n1, n2: VNode, container: any, parentInstance, anchor) {
    mountChildren(n2.childrens, container, parentInstance, anchor);
  }

  function mountChildren(childrens, container, parentInstance, anchor) {
    childrens.forEach(v => {
      path(null, v, container, parentInstance, anchor);
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
