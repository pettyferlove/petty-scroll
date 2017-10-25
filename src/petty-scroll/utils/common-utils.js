import Vue from 'vue'
/*
* 判断滚动条宽度
* */
var scrollBarWidth

export default function () {
  if (Vue.prototype.$isServer) return 0
  if (scrollBarWidth !== undefined) return scrollBarWidth
  const outer = document.createElement('div')
  outer.overflow = 'scroll'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)
  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'
  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)
  const widthWithScroll = inner.offsetWidth
  outer.parentNode.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll
  return scrollBarWidth
}

export const SCROLLBAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top'
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left'
  }
}

export function thumbStyle (move, size, bar, barStyle) {
  const style = {}
  const translate = 'translate' + bar.axis + '(' + move + '%)'
  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.webkitTransform = translate
  style.backgroundColor = barStyle.color
  bar.size === 'height' ? style.width = barStyle.width : style.height = barStyle.width
  style.opacity = barStyle.barOpacityMin
  return style
}
