import { h, provide, inject } from '../../lib/guide-mini-vue.esm.js'

export const App = {
  name: 'app',
  setup () {
    provide("child", "test")
    provide("test", "test")
    const test = inject("test");
    console.log(test);
  },

  render () {
    // const 
    const app = h("p", {}, "app")
    return h('div', {}, [app, h(Child1)]);
  }
}

const Child1 = {
  name: 'child1',
  setup () {
    provide("child", "child1")
    const val = inject("child");
    console.log('val', val);
    return {
      val
    }
  },
  render () {
    // const 
    const child1 = h('p', {}, "child1 inject is " + this.val);

    return h('div', {}, [child1, h(Child2)]);
  }
}

const Child2 = {
  name: 'child2',
  setup () {
    const val = inject("child")
    const test = inject("test")
    const test1 = inject("test1")
    console.log('val', val);
    console.log('test1', test1);
    return {
      val, test
    }
  },
  render () {
    // const 
    return h('div', {}, "child2 inject is " + this.val + " test is " + this.test );
  }
}