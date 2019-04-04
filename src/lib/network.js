import bytes from 'bytes'

let ping

/**
 * Get the user IP throught the webkitRTCPeerConnection
 * @param callback
 * @return undefined
 *
 * Compatibility: Firefox and Chrome
 *
 * Based on code from: https://ourcodeworld.com/articles/read/257/how-to-get-the-client-ip-address-with-javascript-only
 */
export function getLocalIP(callback) {
  const myPeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection
  const pc = new myPeerConnection({
    iceServers: []
  })
  const noop = function() {}
  const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/g
  let localIPs = {}

  function iterateIP(ip) {
    if (!localIPs[ip]) callback(ip)
    localIPs[ip] = true
  }

  // create a bogus data channel
  pc.createDataChannel('')

  // create offer and set local description
  pc.createOffer()
    .then(sdp => {
      sdp.sdp.split('\n').forEach(line => {
        if (line.indexOf('candidate') < 0) return
        line.match(ipRegex).forEach(iterateIP)
      })

      pc.setLocalDescription(sdp, noop, noop)
    })
    .catch(err => {
      console.error(err)
    })

  // listen for candidate events
  pc.onicecandidate = ice => {
    if (
      !ice ||
      !ice.candidate ||
      !ice.candidate.candidate ||
      !ice.candidate.candidate.match(ipRegex)
    ) {
      return
    }

    ice.candidate.candidate.match(ipRegex).forEach(iterateIP)
  }
}

export function getDownlink() {
  if (!navigator || !navigator.connection) {
    return null
  }
  return `${navigator.connection.downlink || 0} Mb/s`
}

export function getRTT() {
  if (!navigator || !navigator.connection) {
    return null
  }
  return `${navigator.connection.rtt || 0} milliseconds`
}

export function getPing() {
  if (ping) {
    return Promise.resolve(ping)
  }
  const start = performance.now()
  return fetch(`/ping.txt?cacheBust=${Math.random()}`, {
    headers: { 'Accept-Encoding': 'q=0' }
  }).then(() => {
    const end = performance.now()
    const ms = end - start
    return Math.floor(ms)
  })
}

function test1MB() {
  return fetch(`/1MB.zip?cacheBust=${Math.random()}`, {
    headers: { 'Accept-Encoding': 'q=0' }
  })
}

export async function testDownlink(callback) {
  const FILE_SIZE_BYTES = 1000000 // 1MB
  const pong = await getPing()
  console.log('Ping to ianlamb.com', pong)

  let aggregateSize = 0
  let aggregateTime = 0
  for (let i = 0; i < 10; i++) {
    const start = performance.now()
    await test1MB()
    const end = performance.now()
    const seconds = Math.max(0, end - start - pong) / 1000
    aggregateSize += FILE_SIZE_BYTES
    aggregateTime += seconds
    console.log(aggregateSize, aggregateTime)
    const size = bytes(Math.floor((aggregateSize / aggregateTime) * 8), {
      // 1MB = 8Mb
      unitSeparator: ':'
    })
    let speed = '--'
    if (size) {
      const sizeTokens = size.split(':')
      // convert bytes labeling to bits
      speed = `${sizeTokens[0]} ${sizeTokens[1][0]}bps`
    }
    callback(speed)
  }
  return aggregateTime
}

export default {
  getLocalIP,
  getDownlink,
  getRTT,
  testDownlink
}
