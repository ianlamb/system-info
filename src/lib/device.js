/* eslint-disable */

const device = {}

if (typeof window !== 'undefined') {
  const changeOrientationList = []

  // The <html> element.
  const documentElement = window.document.documentElement

  // The client user agent string.
  // Lowercase, so we can use the more efficient indexOf(), instead of Regex
  const userAgent = window.navigator.userAgent.toLowerCase()

  // Detectable television devices.
  const television = [
    'googletv',
    'viera',
    'smarttv',
    'internet.tv',
    'netcast',
    'nettv',
    'appletv',
    'boxee',
    'kylo',
    'roku',
    'dlnadoc',
    'pov_tv',
    'hbbtv',
    'ce-html'
  ]

  // Main functions
  // --------------

  device.macos = function() {
    return find('mac')
  }

  device.ios = function() {
    return device.iphone() || device.ipod() || device.ipad()
  }

  device.iphone = function() {
    return !device.windows() && find('iphone')
  }

  device.ipod = function() {
    return find('ipod')
  }

  device.ipad = function() {
    return find('ipad')
  }

  device.android = function() {
    return !device.windows() && find('android')
  }

  device.androidPhone = function() {
    return device.android() && find('mobile')
  }

  device.androidTablet = function() {
    return device.android() && !find('mobile')
  }

  device.blackberry = function() {
    return find('blackberry') || find('bb10') || find('rim')
  }

  device.blackberryPhone = function() {
    return device.blackberry() && !find('tablet')
  }

  device.blackberryTablet = function() {
    return device.blackberry() && find('tablet')
  }

  device.windows = function() {
    return find('windows')
  }

  device.windowsPhone = function() {
    return device.windows() && find('phone')
  }

  device.windowsTablet = function() {
    return device.windows() && (find('touch') && !device.windowsPhone())
  }

  device.fxos = function() {
    return (find('(mobile') || find('(tablet')) && find(' rv:')
  }

  device.fxosPhone = function() {
    return device.fxos() && find('mobile')
  }

  device.fxosTablet = function() {
    return device.fxos() && find('tablet')
  }

  device.meego = function() {
    return find('meego')
  }

  device.cordova = function() {
    return window.cordova && location.protocol === 'file:'
  }

  device.nodeWebkit = function() {
    return typeof window.process === 'object'
  }

  device.mobile = function() {
    return (
      device.androidPhone() ||
      device.iphone() ||
      device.ipod() ||
      device.windowsPhone() ||
      device.blackberryPhone() ||
      device.fxosPhone() ||
      device.meego()
    )
  }

  device.tablet = function() {
    return (
      device.ipad() ||
      device.androidTablet() ||
      device.blackberryTablet() ||
      device.windowsTablet() ||
      device.fxosTablet()
    )
  }

  device.desktop = function() {
    return !device.tablet() && !device.mobile()
  }

  device.television = function() {
    let i = 0
    while (i < television.length) {
      if (find(television[i])) {
        return true
      }
      i++
    }
    return false
  }

  device.portrait = function() {
    if (
      screen.orientation &&
      Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
    ) {
      return screen.orientation.type.includes('portrait')
    }
    return window.innerHeight / window.innerWidth > 1
  }

  device.landscape = function() {
    if (
      screen.orientation &&
      Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
    ) {
      return screen.orientation.type.includes('landscape')
    }
    return window.innerHeight / window.innerWidth < 1
  }

  // Private Utility Functions
  // -------------------------

  // Simple UA string search
  function find(needle) {
    return userAgent.indexOf(needle) !== -1
  }

  // Check if documentElement already has a given class.
  function hasClass(className) {
    return documentElement.className.match(new RegExp(className, 'i'))
  }

  // Add one or more CSS classes to the <html> element.
  function addClass(className) {
    let currentClassNames = null
    if (!hasClass(className)) {
      currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, '')
      documentElement.className = `${currentClassNames} ${className}`
    }
  }

  // Remove single CSS class from the <html> element.
  function removeClass(className) {
    if (hasClass(className)) {
      documentElement.className = documentElement.className.replace(
        ` ${className}`,
        ''
      )
    }
  }

  // Orientation Handling
  // --------------------

  // Handle device orientation changes.
  function handleOrientation() {
    if (device.landscape()) {
      removeClass('portrait')
      addClass('landscape')
      walkOnChangeOrientationList('landscape')
    } else {
      removeClass('landscape')
      addClass('portrait')
      walkOnChangeOrientationList('portrait')
    }
    setOrientationCache()
  }

  function walkOnChangeOrientationList(newOrientation) {
    for (const index in changeOrientationList) {
      changeOrientationList[index](newOrientation)
    }
  }

  device.onChangeOrientation = function(cb) {
    if (typeof cb == 'function') {
      changeOrientationList.push(cb)
    }
  }

  // Detect whether device supports orientationchange event,
  // otherwise fall back to the resize event.
  let orientationEvent = 'resize'
  if (Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
    orientationEvent = 'orientationchange'
  }

  // Listen for changes in orientation.
  if (window.addEventListener) {
    window.addEventListener(orientationEvent, handleOrientation, false)
  } else if (window.attachEvent) {
    window.attachEvent(orientationEvent, handleOrientation)
  } else {
    window[orientationEvent] = handleOrientation
  }

  handleOrientation()

  // Public functions to get the current value of type, os, or orientation
  // ---------------------------------------------------------------------

  function findMatch(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (device[arr[i]]()) {
        return arr[i]
      }
    }
    return 'unknown'
  }

  device.type = findMatch(['mobile', 'tablet', 'desktop'])
  device.os = findMatch([
    'ios',
    'iphone',
    'ipad',
    'ipod',
    'android',
    'blackberry',
    'windows',
    'fxos',
    'meego',
    'television'
  ])

  function setOrientationCache() {
    device.orientation = findMatch(['portrait', 'landscape'])
  }

  setOrientationCache()
}

export default device
