import { h, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js';
export const App = {
  name: 'app',
  setup () {
    const currentInstance = getCurrentInstance();
    console.log('app currentInstance', currentInstance);
  },

  render () {
    const app = h("div", {}, "app");
    return h('div', {}, [app, h(Foo)]);
  }
}