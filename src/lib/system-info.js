import '../polyfills/String.prototype.padStart'

// import { store } from 'react-easy-state'
// const data = store()

import platform from './platform'
import device from './device'
import getUserIP from './getUserIP'

console.log(platform)

function checkWebGLSupport() {
  var A = document.createElement('canvas'),
    e =
      'probablySupportsContext' in A
        ? 'probablySupportsContext'
        : 'supportsContext'
  return e in A
    ? A[e]('webgl') || A[e]('experimental-webgl')
    : 'WebGLRenderingContext' in window
}

function capitalize(s) {
  return s.split(' ').reduce((prev, curr) => {
    return `${prev} ${curr[0].toUpperCase()}${curr.slice(1, curr.length)}`
  }, '')
}

function getAspectRatio() {
  // greatest common divisor
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b)
  }
  const w = window.screen.width
  const h = window.screen.height
  const r = gcd(w, h)
  return `${w / r}:${h / r}`
}

function getScreenOrientation() {
  if (window.matchMedia('(orientation: portrait)').matches) {
    return 'Portrait'
  } else if (window.matchMedia('(orientation: landscape)').matches) {
    return 'Landscape'
  }
  return 'Unknown'
}

function getGPU() {
  if (checkWebGLSupport()) {
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const gl = canvas.getContext('webgl')
    if (canvas.getContext('webgl')) {
      var debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      if (renderer.includes('ANGLE (')) {
        // cleanup
        renderer = renderer.slice(7)
        renderer = renderer.slice(0, -1)
      }
      return renderer
    } else {
      return null
    }
  } else {
    return null
  }
}

function getSystemTime() {
  const now = new Date()
  const hours = `${now.getHours()}`.padStart(2, '0')
  const minutes = `${now.getMinutes()}`.padStart(2, '0')
  const seconds = `${now.getSeconds()}`.padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function init(store) {
  store.browser = {
    name: platform.name,
    version: platform.version,
    engine: platform.layout,
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage || 'Unknown',
    cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled',
  }
  store.device = {
    name: `${capitalize(device.type)}`,
    os: platform.os ? platform.os.toString() : 'Unknown',
    battery: 'n/a',
    systemTime: '',
  }
  store.network = {
    localIp: '',
    publicIp: '',
    isp: '',
    type: '',
    downlink: `${navigator.connection.downlink || 0} Mb/s`,
    rtt: `${navigator.connection.rtt || 0} milliseconds`,
  }
  store.graphics = {
    resolution: `${window.screen.width} x ${window.screen.height}`,
    aspectRatio: getAspectRatio(),
    colorDepth: `${window.screen.colorDepth}`,
    screenOrientation: getScreenOrientation(),
    gpu: getGPU() || 'Unknown',
  }

  function setBattery(battery) {
    store.device.battery = `${Math.floor(battery.level * 100)}%`
  }

  // local IP
  getUserIP(localIp => {
    console.log('localIp', localIp)
    store.network.localIp = localIp
  })

  // battery
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      setBattery(battery)
    })
  } else if (
    navigator.battery ||
    navigator.webkitBattery ||
    navigator.mozBattery ||
    navigator.msBattery
  ) {
    const battery =
      navigator.battery ||
      navigator.webkitBattery ||
      navigator.mozBattery ||
      navigator.msBattery
    setBattery(battery)
    battery.onlevelchange = () => setBattery(battery.level)
  }

  // screen orientation
  window.addEventListener('orientationchange', () => {
    window.setTimeout(
      () => (store.graphics.screenOrientation = getScreenOrientation()),
      0
    )
  })

  // system clock
  function updateClock() {
    const systemTime = getSystemTime()
    if (store.device.systemTime !== systemTime) {
      store.device.systemTime = systemTime
    }
    window.requestAnimationFrame(updateClock)
  }
  window.requestAnimationFrame(updateClock)

  // public ip/geo data
  return fetch('http://ip-api.com/json')
    .then(res => res.json())
    .then(ip => {
      store.network.publicIp = ip.query
      store.network.isp = ip.as
      store.network.type = ip.mobile
        ? navigator.connection.effectiveType
        : 'Ethernet'
      store.geo = {
        location: `${ip.city}, ${ip.regionName}, ${ip.countryCode}`,
        lat: ip.lat,
        lon: ip.lon,
        timezone: ip.timezone,
        city: ip.city,
        country: ip.country,
        countryCode: ip.countryCode,
        region: ip.region,
        regionName: ip.regionName,
      }
    })
    .catch(err => {
      console.error(err)
    })
}
