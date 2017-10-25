/* istanbul ignore next */

import Vue from 'vue'

const isServer = Vue.prototype.$isServer
const SPECIAL_CHARS_REGEXP = '/([\\:\\-\\_]+(.))/g'
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const ieVersion = isServer ? 0 : Number(document.documentMode)

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
/* istanbul ignore next */
const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

/* istanbul ignore next */
export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (ele, event, handler) {
      if (ele && event && handler) {
        ele.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (ele, event, handler) {
      if (ele && event && handler) {
        ele.attachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (ele, event, handler) {
      if (ele && event) {
        ele.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (ele, event, handler) {
      if (ele && event) {
        ele.detachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

/* istanbul ignore next */
export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
};

/* istanbul ignore next */
export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
};

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
};

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function (ele, styleName) {
  if (isServer) return
  if (!ele || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return ele.filters.item('alpha').opacity / 100
        } catch (e) {
          return 1.0
        }
      default:
        return (ele.style[styleName] || ele.currentStyle ? ele.currentStyle[styleName] : null)
    }
  } catch (e) {
    return ele.style[styleName]
  }
} : function (ele, styleName) {
  if (isServer) return
  if (!ele || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed = document.defaultView.getComputedStyle(ele, '')
    return ele.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return ele.style[styleName]
  }
}

/* istanbul ignore next */
export function setStyle (ele, styleName, value) {
  if (!ele || !styleName) return

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(ele, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity' && ieVersion < 9) {
      ele.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
    } else {
      ele.style[styleName] = value
    }
  }
};

const attachEvent = isServer ? {} : document.attachEvent
const RESIZE_ANIMATION_NAME = 'resizeanim'
let keyFramePrefix = ''
let animationStartEvent = 'animationstart'
export const addResizeListener = function (ele, fn) {
  if (isServer) return
  if (attachEvent) {
    ele.attachEvent('onresize', fn)
  } else {
    if (!ele.__resizeTrigger__) {
      if (getComputedStyle(ele).position === 'static') {
        ele.style.position = 'relative'
      }
      createStyles()
      ele.__resizeLast__ = {}
      ele.__resizeListeners__ = []

      const resizeTrigger = ele.__resizeTrigger__ = document.createElement('div')
      resizeTrigger.className = 'resize-triggers'
      resizeTrigger.innerHTML = '<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>'
      ele.appendChild(resizeTrigger)

      resetTrigger(ele)
      ele.addEventListener('scroll', scrollListener, true)

      /* Listen for a css animation to detect ele display/re-attach */
      if (animationStartEvent) {
        resizeTrigger.addEventListener(animationStartEvent, function (event) {
          if (event.animationName === RESIZE_ANIMATION_NAME) {
            resetTrigger(ele)
          }
        })
      }
    }
    ele.__resizeListeners__.push(fn)
  }
}

let stylesCreated = false
/* istanbul ignore next */
const createStyles = function () {
  if (!stylesCreated && !isServer) {
    const animationKeyframes = `@${keyFramePrefix}keyframes ${RESIZE_ANIMATION_NAME} { from { opacity: 0; } to { opacity: 0; } } `
    const animationStyle = `${keyFramePrefix}animation: 1ms ${RESIZE_ANIMATION_NAME};`

    // opacity: 0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
    const css = `${animationKeyframes}.resize-triggers { ${animationStyle} visibility: hidden; opacity: 0; }.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1 }.resize-triggers > div { background: #eee; overflow: auto; }.contract-trigger:before { width: 200%; height: 200%; }`

    const head = document.head || document.getElementsByTagName('head')[0]
    const style = document.createElement('style')

    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    head.appendChild(style)
    stylesCreated = true
  }
}

/* istanbul ignore next */
const resetTrigger = function (element) {
  const trigger = element.__resizeTrigger__
  const expand = trigger.firstElementChild
  const contract = trigger.lastElementChild
  const expandChild = expand.firstElementChild

  contract.scrollLeft = contract.scrollWidth
  contract.scrollTop = contract.scrollHeight
  expandChild.style.width = expand.offsetWidth + 1 + 'px'
  expandChild.style.height = expand.offsetHeight + 1 + 'px'
  expand.scrollLeft = expand.scrollWidth
  expand.scrollTop = expand.scrollHeight
}

/* istanbul ignore next */
const scrollListener = function (event) {
  resetTrigger(this)
  if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__)
  this.__resizeRAF__ = requestFrame(() => {
    if (checkTriggers(this)) {
      this.__resizeLast__.width = this.offsetWidth
      this.__resizeLast__.height = this.offsetHeight
      this.__resizeListeners__.forEach((fn) => {
        fn.call(this, event)
      })
    }
  })
}

/* istanbul ignore next */
const cancelFrame = (function () {
  if (isServer) return
  const cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout
  return function (id) {
    return cancel(id)
  }
})()

/* istanbul ignore next */
const requestFrame = (function () {
  if (isServer) return
  const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
    function (fn) {
      return window.setTimeout(fn, 20)
    }
  return function (fn) {
    return raf(fn)
  }
})()

/* istanbul ignore next */
const checkTriggers = function (ele) {
  return ele.offsetWidth !== ele.__resizeLast__.width || ele.offsetHeight !== ele.__resizeLast__.height
}

/* istanbul ignore next */
export const removeResizeListener = function (ele, fn) {
  if (attachEvent) {
    ele.detachEvent('onresize', fn)
  } else {
    ele.__resizeListeners__.splice(ele.__resizeListeners__.indexOf(fn), 1)
    if (!ele.__resizeListeners__.length) {
      ele.removeEventListener('scroll', scrollListener)
      ele.__resizeTrigger__ = !ele.removeChild(ele.__resizeTrigger__)
    }
  }
}
