import Scrollbar from './petty-scroll/main.vue'

/* istanbul ignore next */
Scrollbar.install = function (Vue) {
  Vue.component(Scrollbar.name, Scrollbar)
}

export default Scrollbar
