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

export default {
  getLocalIP
}
