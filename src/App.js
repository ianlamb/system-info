import React, { Component } from 'react'
import { view, store } from 'react-easy-state'
import Header from './components/Header'
import Footer from './components/Footer'
import Search from './components/Search'
import Toasts from './components/Toasts'
import { Cards, Card } from './components/Card'
import StatItem from './components/StatItem'
import './App.css'
import device from './lib/device'
import network from './lib/network'
import { capitalize, getSystemTime } from './lib/helpers'
import manifest from './manifest.json'

import { getAspectRatio, getScreenOrientation, getGPU } from './lib/graphics'
import platform from './lib/platform'

const data = store({
  search: '',
  network: {},
  device: {},
  browser: {},
  location: {},
  geo: {},
  graphics: {}
})

class App extends Component {
  componentDidMount() {
    // set initial data
    data.browser = {
      name: platform.name,
      version: platform.version,
      displayName: `${platform.name} ${platform.version}`,
      engine: platform.layout,
      userAgent: navigator.userAgent,
      language: navigator.language || navigator.userLanguage || 'Unknown',
      cookies: navigator.cookieEnabled ? 'Enabled' : 'Disabled'
    }
    data.device = {
      name: `${capitalize(device.type)}`,
      os: platform.os ? platform.os.toString() : 'Unknown',
      battery: '',
      systemTime: ''
    }
    data.network = {
      localIp: '',
      publicIp: '',
      isp: '',
      type: '',
      downlink: network.getDownlink(),
      rtt: network.getRTT()
    }
    data.graphics = {
      resolution: `${window.screen.width} x ${window.screen.height}`,
      aspectRatio: getAspectRatio(),
      colorDepth: `${window.screen.colorDepth}`,
      screenOrientation: getScreenOrientation(),
      gpu: getGPU() || 'Unknown'
    }

    // local IP
    network.getLocalIP(localIp => {
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
  }

  render() {
    if (!data) return null

    const search = data.search.toLowerCase()
    const cards = Object.keys(manifest).map(key => {
      const card = manifest[key]
      if (card.type === 'list') {
        const items = card.items
          .filter(
            o =>
              !data.search ||
              (o.label.toLowerCase().indexOf(search) !== -1 ||
                ('' + data[key][o.name]).toLowerCase().indexOf(search) !== -1)
          )
          .map(o => (
            <StatItem
              label={o.label}
              value={data[key][o.name]}
              copyable={o.copyable === true}
              key={o.name}
            />
          ))
        return (
          <Card title={card.title} key={key}>
            {items.length ? (
              items
            ) : (
              <div style={{ textAlign: 'center' }}>--</div>
            )}
          </Card>
        )
      }
      return null
    })

    return (
      <div className="App">
        <Header />
        <Search store={data} />
        <Cards>{cards}</Cards>
        <Footer />
        <Toasts />
      </div>
    )
  }
}

export default view(App)
