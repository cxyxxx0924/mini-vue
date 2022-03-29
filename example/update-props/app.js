import { h, ref } from '../../lib/guide-mini-vue.esm.js'
// import { Foo } from './Foo.js';
export const App = {
  name: 'app',
  setup () {
    const count = ref(0);
    const demo = ref({
      foo: "foo",
      bar: "bar"
    });
    const clickBtn = () => {
      count.value++;
    }
    const clickModifyFoo = () => {
      demo.value.foo = "new-foo"
    }
    const clickEmptyFoo = () => {
      demo.value.foo = undefined
    }
    const clickDeleteBar = () => {
      demo.value = {
        foo: "foo",
      }
    }
    return {
      count,
      clickBtn,
      demo,
      clickModifyFoo,
      clickEmptyFoo,
      clickDeleteBar
    }
  },

  render () {
    console.log("count ", this.count);
    const app = h("div", {}, "app count -> " + this.count);
    const btn = h("button", { onClick: this.clickBtn }, "add one");
    const btnModifyFoo = h("button", { onClick: this.clickModifyFoo }, "modify foo");
    const btnEmptyFoo = h("button", { onClick: this.clickEmptyFoo }, "empty foo");
    const btnDeleteBar = h("button", { onClick: this.clickDeleteBar }, "delete bar");
    return h('div', { ...this.demo },
      [app, btnModifyFoo, btnEmptyFoo, btnDeleteBar]
    )
  }
}