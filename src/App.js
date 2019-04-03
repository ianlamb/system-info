import React, { Component } from 'react'
import { view, store } from 'react-easy-state'
import Header from './components/Header'
import Footer from './components/Footer'
import { Cards, Card } from './components/Card'
import StatItem from './components/StatItem'
import './App.css'
import device from './lib/device'
import { getLocalIP } from './lib/network'
import { capitalize, getSystemTime } from './lib/helpers'

import { getAspectRatio, getScreenOrientation, getGPU } from './lib/graphics'
import platform from './lib/platform'

const data = store({
  network: {},
  device: {},
  browser: {},
  location: {},
  geo: {},
  graphics: {}
})

const TOAST_TTL = 5000

class App extends Component {
  constructor(props) {
    super(props)

    this.toastCount = 0
    this.state = {
      toasts: []
    }
  }

  componentDidMount() {
    // set initial data
    data.browser = {
      name: platform.name,
      version: platform.version,
      engine: platform.layout,
      userAgent: navigator.userAgent,
      language: navigator.language || navigator.userLanguage || 'Unknown',
      cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled'
    }
    data.device = {
      name: `${capitalize(device.type)}`,
      os: platform.os ? platform.os.toString() : 'Unknown',
      battery: 'n/a',
      systemTime: ''
    }
    data.network = {
      localIp: '',
      publicIp: '',
      isp: '',
      type: '',
      downlink: `${navigator.connection.downlink || 0} Mb/s`,
      rtt: `${navigator.connection.rtt || 0} milliseconds`
    }
    data.graphics = {
      resolution: `${window.screen.width} x ${window.screen.height}`,
      aspectRatio: getAspectRatio(),
      colorDepth: `${window.screen.colorDepth}`,
      screenOrientation: getScreenOrientation(),
      gpu: getGPU() || 'Unknown'
    }

    // local IP
    getLocalIP(localIp => {
      data.network.localIp = localIp
    })

    // system clock
    function updateClock() {
      const systemTime = getSystemTime()
      if (data.device.systemTime !== systemTime) {
        data.device.systemTime = systemTime
      }
      window.requestAnimationFrame(updateClock)
    }
    window.requestAnimationFrame(updateClock)

    // battery
    function setBattery(battery) {
      data.device.battery = `${Math.floor(battery.level * 100)}%`
    }
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

    // fetch public ip/geo data
    fetch('//ip-api.com/json')
      .then(res => res.json())
      .then(ip => {
        data.network.publicIp = ip.query
        data.network.isp = ip.as
        data.network.type = ip.mobile
          ? navigator.connection.effectiveType
          : 'Ethernet'
        data.geo = {
          location: `${ip.city}, ${ip.regionName}, ${ip.countryCode}`,
          lat: ip.lat,
          lon: ip.lon,
          timezone: ip.timezone,
          city: ip.city,
          country: ip.country,
          countryCode: ip.countryCode,
          region: ip.region,
          regionName: ip.regionName
        }
      })
      .catch(err => {
        console.error(err)
      })

    // event listeners
    window.addEventListener('resize', () => {
      console.log('resize event fired')
      data.graphics.resolution = `${window.screen.width} x ${
        window.screen.height
      }`
      data.graphics.aspectRatio = getAspectRatio()
    })
    window.addEventListener('rotationchange', () => {
      console.log('rotationchange event fired')
      window.setTimeout(
        () => (data.graphics.screenOrientation = getScreenOrientation()),
        0
      )
    })
    window.addEventListener('textcopied', e => {
      if (e.detail) {
        this.addToast(
          `Copied ${e.detail.name} "${e.detail.value}" to clip board.`
        )
      }
    })
  }

  componentDidUpdate() {}

  addToast(text) {
    const toast = {
      id: this.toastCount++,
      text
    }
    this.setState({
      toasts: [...this.state.toasts, toast]
    })
    window.setTimeout(() => {
      this.removeToast(toast.id)
    }, TOAST_TTL)
  }

  removeToast(id) {
    let toasts = this.state.toasts.filter(toast => toast.id !== id)
    this.setState({
      toasts
    })
  }

  render() {
    if (!data) return null
    return (
      <div className="App">
        <Header />
        <Cards>
          <Card title="Network">
            <StatItem
              label="Public IP"
              value={data.network.publicIp}
              copyable={true}
            />
            <StatItem
              label="Local IP"
              value={data.network.localIp}
              copyable={true}
            />
            <StatItem label="Connection" value={data.network.type} />
            <StatItem label="Downlink" value={data.network.downlink} />
            <StatItem label="RTT Estimate" value={data.network.rtt} />
            <StatItem label="ISP" value={data.network.isp} />
          </Card>
          <Card title="Browser">
            <StatItem
              label="Browser"
              value={`${data.browser.name} ${data.browser.version}`}
            />
            <StatItem label="Engine" value={data.browser.engine} />
            <StatItem label="Language" value={data.browser.language} />
            <StatItem label="Cookies" value={data.browser.cookies} />
            <StatItem label="User Agent" value={data.browser.userAgent} />
          </Card>
          <Card title="Device">
            <StatItem label="Device" value={data.device.name} />
            <StatItem label="Operating System" value={data.device.os} />
            <StatItem label="Battery Level" value={data.device.battery} />
            <StatItem label="System Time" value={data.device.systemTime} />
            <StatItem label="Timezone" value={data.geo.timezone} />
            <StatItem label="Location" value={data.geo.location} />
            <StatItem label="Latitude" value={data.geo.lat} />
            <StatItem label="Longitude" value={data.geo.lon} />
          </Card>
          <Card title="Graphics">
            <StatItem label="Resolution" value={data.graphics.resolution} />
            <StatItem label="Aspect Ratio" value={data.graphics.aspectRatio} />
            <StatItem label="Color Depth" value={data.graphics.colorDepth} />
            <StatItem
              label="Screen Orientation"
              value={data.graphics.screenOrientation}
            />
            <StatItem label="Video Card" value={data.graphics.gpu} />
          </Card>
        </Cards>
        <Footer />

        <ul className="App-toasts">
          {this.state.toasts.map(toast => (
            <li className="App-toast" key={toast.id}>
              {toast.text}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default view(App)
