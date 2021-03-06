import { h } from "../../lib/guide-mini-vue.esm.js"


export const Foo = {
  name: 'foo',
  setup(props) {
    console.log(props);
    props.count++;
    return {
      propsName: 'foo 组件 props is ' + props.msg
    }
  },
  render() {
    return h('p', {}, '我是 ' + this.msg + ' count 是 ' + this.count);
  }
}