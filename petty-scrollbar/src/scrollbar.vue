<script>
  import { SCROLLBAR_MAP, thumbStyle } from './utils/common-utils'

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
      },
      wrap: function () {
        return this.$parent.wrap
      }
    },
    render: function (h) {
      let thumbbar = h('div', {
        ref: 'thumbbar',
        class: {
          'petty-scrollbar-thumb': true
        },
        on: {
          mousedown: this.clickThumbHandler
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
        on: {
          mouseenter: this.handleRailMouseEnter,
          mousedown: this.clickTrackHandler
        },
        style: this.railStyles
      }, ([thumbbar]))
      return railbar
    },
    methods: {
      clickThumbHandler (e) {
        this.startDrag(e)
        this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]))
      },
      handleRailMouseEnter: function () {
        this.$refs.railbar.children[0].style.opacity = 1
      },
      clickTrackHandler: function (e) {
        const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client])
        const thumbHalf = (this.$refs.thumbbar[this.bar.offset] / 2)
        const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset])

        this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100)
      },

      startDrag: function (e) {
        e.stopImmediatePropagation()
        this.cursorDown = true
        document.addEventListener('mousemove', this.mouseMoveDocumentHandler)
        document.addEventListener('mouseup', this.mouseUpDocumentHandler)
        document.onselectstart = () => false
      },

      mouseMoveDocumentHandler: function (e) {
        if (this.cursorDown === false) return
        const prevPage = this[this.bar.axis]
        if (!prevPage) return
        const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1)
        const thumbClickPosition = (this.$refs.thumbbar[this.bar.offset] - prevPage)
        const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset])
        this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100)
      },

      mouseUpDocumentHandler: function (e) {
        this.cursorDown = false
        this[this.bar.axis] = 0
        document.removeEventListener('mousemove', this.mouseMoveDocumentHandler)
        document.onselectstart = null
      }
    },
    destroyed: function () {
      document.removeEventListener('mouseup', this.mouseUpDocumentHandler)
    }
  }
</script>

<style>

</style>

