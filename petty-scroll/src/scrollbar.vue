<script>
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
    render: function (h) {
      let wrap = this.$slots.default
      let railbar = h('div', {
        attrs: {
          id: 'foo'
        },
        ref: 'railbar',
        class: {
          'petty-scrollbar-bar': true
        },
        style: {
          backgroundColor: this.railStyle.color,
          zIndex: this.railStyle.zIndex,
          width: this.barStyle.width,
          right: this.railStyle.marginRight,
          height: this.barStyle.width,
          bottom: this.railStyle.marginBottom
        }
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

