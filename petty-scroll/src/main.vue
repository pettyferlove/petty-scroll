<script>
    import Scrollbar from './scrollbar.vue'

    export default {
      name: 'PettyScroll',
      components: { Scrollbar },
      props: {
        native: Boolean,
        wrapStyle: {},
        wrapClass: {},
        viewClass: {},
        viewStyle: {},
        noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
        tag: {
          type: String,
          default: 'div'
        },
        barOption: {}
      },
      data () {
        return {
          sizeWidth: '0',
          sizeHeight: '0',
          moveX: 0,
          moveY: 0,
          preScrollHeigt: 0,
          opt: {
            barColor: '#959595',   // 滚动条颜色
            barWidth: 6,           // 滚动条宽度
            railColor: '#eee',     // 导轨颜色
            barMarginRight: 0,     // 垂直滚动条距离整个容器右侧距离单位（px）
            barMaginBottom: 0,     // 水平滚动条距离底部距离单位（px)
            barOpacityMin: 0.3,      // 滚动条非激活状态下的透明度
            zIndex: 'auto',        // 滚动条z-Index
            autohidemode: true,     // 自动隐藏模式
            horizrailenabled: true // 是否显示水平滚动条
          }
        }
      },
      render: function (h) {
        let style = this.wrapStyle
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
          style: {
            style
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
                barStyle: barStyle,
                railStyle: railStyle,
                move: this.moveX,
                size: this.sizeWidth
              }
            })

            nodes = ([wrap, scrollHbar, scrollVbar])
          } else {
            let scrollVbar = h('Scrollbar', {
              ref: 'scrollVbar',
              props: {
                barStyle: barStyle,
                railStyle: railStyle,
                move: this.moveX,
                size: this.sizeWidth
              }
            })

            nodes = ([wrap, scrollVbar])
          }
        } else {
          nodes = ([wrap])
        }

        return h('div', {class: 'petty-scrollbar'}, nodes)
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
    opacity: 1;
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

