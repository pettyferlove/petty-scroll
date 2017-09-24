<script>
  import SCROLLBAR_MAP from './utils/scrollbar-V&H'

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
      let railbar = h('div', {
        attrs: {
          id: 'foo'
        },
        ref: 'railbar',
        class: {
          'petty-scrollbar-bar': true,
          'is-horizontal': !this.vertical,
          'is-vertical': this.vertical
        },
        style: this.railStyles
      })
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

