export function checkWebGLSupport() {
  const A = document.createElement('canvas')
  const e =
    'probablySupportsContext' in A
      ? 'probablySupportsContext'
      : 'supportsContext'
  return e in A
    ? A[e]('webgl') || A[e]('experimental-webgl')
    : 'WebGLRenderingContext' in window
}

export function getAspectRatio() {
  // greatest common divisor
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b)
  }
  const w = window.screen.width
  const h = window.screen.height
  const r = gcd(w, h)
  return `${w / r}:${h / r}`
}

export function getScreenOrientation() {
  if (window.matchMedia('(orientation: portrait)').matches) {
    return 'Portrait'
  } else if (window.matchMedia('(orientation: landscape)').matches) {
    return 'Landscape'
  }
  return 'Unknown'
}

export function getGPU() {
  if (checkWebGLSupport()) {
    const canvas = document.createElement('canvas')
    canvas.style.display = 'none'
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

export default {
  getAspectRatio,
  getScreenOrientation,
  getGPU
}
