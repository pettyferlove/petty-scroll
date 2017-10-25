<script>
    import Scrollbar from './scrollbar.vue'
    import CalcScrollbarWidth from './utils/common-utils'
    import { addResizeListener, removeResizeListener } from './utils/resize-event'

    export default {
      name: 'PettyScroll',
      components: { Scrollbar },
      props: {
        native: Boolean,
        wrapStyle: {},
        wrapClass: {},
        viewClass: {},
        viewStyle: {},
        noresize: Boolean,
        tag: {
          type: String,
          default: 'div'
        },
        barOption: {}
      },
      computed: {
        wrap () {
          return this.$refs.wrap
        }
      },
      data () {
        return {
          sizeWidth: '0',
          sizeHeight: '0',
          moveX: 0,
          moveY: 0,
          preScrollHeigt: 0,
          opt: {
            barColor: '#787878',
            barWidth: 6,
            railColor: '#eee',
            barMarginRight: 0,
            barMaginBottom: 0,
            barOpacityMin: 0.3,
            zIndex: 'auto',
            autohidemode: true,
            horizrailenabled: true
          }
        }
      },
      render: function (h) {
        let wrapMargin = '-' + CalcScrollbarWidth() + 'px'
        let barStyle = {
          color: this.opt.barColor,
          width: this.opt.barWidth + 'px',
          barOpacityMin: this.opt.barOpacityMin
        }
        let railStyle = {
          zIndex: this.opt.zIndex,
          color: this.opt.railColor,
          marginRight: this.opt.barMarginRight + 'px',
          marginBottom: this.opt.barMaginBottom + 'px'
        }

        const view = h(this.tag, {
          class: ['el-scrollbar-view', this.viewClass],
          style: this.viewStyle,
          ref: 'resize'
        }, this.$slots.default)

        const wrap = h('div', {
          ref: 'wrap',
          on: {
            scroll: this.handleScroll,
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave
          },
          style: {
            marginRight: wrapMargin,
            marginBottom: wrapMargin
          },
          class: {
            'petty-scrollbar-wrap': true
          }
        }, ([view]))
        let nodes
        if (!this.native) {
          if (this.opt.horizrailenabled === true) {
            let scrollHbar = h('Scrollbar', {
              ref: 'scrollHbar',
              props: {
                barStyle: barStyle,
                railStyle: railStyle,
                move: this.moveX,
                size: this.sizeWidth
              }
            })

            let scrollVbar = h('Scrollbar', {
              ref: 'scrollVbar',
              props: {
                vertical: this.opt.horizrailenabled,
                barStyle: barStyle,
                railStyle: railStyle,
                move: this.moveY,
                size: this.sizeHeight
              }
            })

            nodes = ([wrap, scrollHbar, scrollVbar])
          } else {
            let scrollVbar = h('Scrollbar', {
              ref: 'scrollVbar',
              props: {
                vertical: this.opt.horizrailenabled,
                barStyle: barStyle,
                railStyle: railStyle,
                move: this.moveY,
                size: this.sizeHeight
              }
            })

            nodes = ([wrap, scrollVbar])
          }
        } else {
          nodes = ([wrap])
        }

        return h('div', {class: 'petty-scrollbar'}, nodes)
      },
      methods: {
        handleScroll: function () {
          const wrap = this.wrap
          if (this.preScrollHeigt !== wrap.scrollHeight) {
            this.preScrollHeigt = wrap.scrollHeight
            this.update()
          }
          this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight)
          this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth)
        },
        handleMouseEnter: function () {
          if (this.$refs.scrollHbar) {
            this.$refs.scrollHbar.$el.children[0].style.opacity = 0.6
          }
          if (this.$refs.scrollVbar) {
            this.$refs.scrollVbar.$el.children[0].style.opacity = 0.6
          }
        },
        handleMouseLeave: function () {
          if (this.$refs.scrollHbar) {
            this.$refs.scrollHbar.$el.children[0].style.opacity = this.opt.barOpacityMin
          }
          if (this.$refs.scrollVbar) {
            this.$refs.scrollVbar.$el.children[0].style.opacity = this.opt.barOpacityMin
          }
        },
        update: function () {
          let heightPercentage, widthPercentage
          const wrap = this.wrap
          if (!wrap) return
          heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight)
          widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth)
          this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : ''
          this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : ''
          if (this.$refs.scrollVbar) {
            if (this.sizeHeight === '') {
              this.$refs.scrollVbar.$el.style.display = 'none'
            } else {
              this.$refs.scrollVbar.$el.style.display = 'block'
            }
          }
          if (this.$refs.scrollHbar) {
            if (this.sizeWidth === '') {
              this.$refs.scrollHbar.$el.style.display = 'none'
            } else {
              this.$refs.scrollHbar.$el.style.display = 'block'
            }
          }
        }
      },
      mounted: function () {
        if (this.native) return
        this.$nextTick(this.update)
        !this.noresize && addResizeListener(this.$refs.resize, this.update)
      },

      beforeDestroy () {
        if (this.native) return
        !this.noresize && removeResizeListener(this.$refs.resize, this.update)
      }
    }
</script>

<style>
  .petty-scrollbar-wrap{
    overflow: scroll;
  }
  .petty-scrollbar-wrap--hidden-default{
    overflow: scroll;
  }
  .petty-scrollbar{
    overflow: hidden;
    position: relative;
  }
  .petty-scrollbar-bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity .12s ease-out;
  }
  .petty-scrollbar-bar.is-horizontal {
    height: 6px;
    left: 0px;
    right: 0px;
    background-color: #eee;
  }
  .petty-scrollbar-bar.is-vertical {
    width: 6px;
    top: 0px;
    bottom: 0px;
    background-color: #eee;
  }
  .petty-scrollbar-thumb {
    position: relative;
    display: block;
    width: 6px;
    height: 6px;
    cursor: pointer;
    border-radius: inherit;
    background-color: #959595;
    opacity: 0.6;
    transition: opacity .34s ease-out;
    -moz-transition: opacity .34s ease-out; /* Firefox 4 */
    -webkit-transition: opacity .34s ease-out; /* Safari 和 Chrome */
    -o-transition: opacity .34s ease-out; /* Opera */
  }
  .petty-scrollbar-bar {
    opacity: 1;
    transition: opacity .34s ease-out;
  }
</style>

