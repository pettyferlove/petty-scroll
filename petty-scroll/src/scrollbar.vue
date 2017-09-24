<script>
  import { SCROLLBAR_MAP, thumbStyle } from './utils/common-scrollbar'

  export default {
    name: 'ScrollBar',
    /**
     * barStyle 主滑动条样式
     * railStyle 滑动栏样式
     */
    props: {
      vertical: Boolean,
      size: String,
      move: Number,
      barStyle: Object,
      railStyle: Object
    },
    computed: {
      bar: function () {
        return SCROLLBAR_MAP[this.vertical ? 'vertical' : 'horizontal']
      },
      railStyles () {
        return this.vertical ? 'background-color:' + this.railStyle.color +
          ';z-Index:' + this.railStyle.zIndex +
          ';width:' + this.barStyle.width +
          ';right:' + this.railStyle.marginRight : 'background-color:' + this.railStyle.color +
          ';z-Index:' + this.railStyle.zIndex +
          ';height:' + this.barStyle.width +
          ';bottom:' + this.railStyle.marginBottom
      }
    },
    render: function (h) {
      let wrap = this.$slots.default
      let thumbbar = h('div', {
        ref: 'thumbbar',
        class: {
          'petty-scrollbar-thumb': true
        },
        style: thumbStyle(this.move, this.size, this.bar, this.barStyle)
      })

      let railbar = h('div', {
        ref: 'railbar',
        class: {
          'petty-scrollbar-bar': true,
          'is-horizontal': !this.vertical,
          'is-vertical': this.vertical
        },
        style: this.railStyles
      }, ([thumbbar]))
      let nodes = ([
        wrap,
        railbar
      ])
      return h('div', nodes)
    }

  }
</script>

<style>

</style>

