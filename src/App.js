import React, { Component } from 'react';
import { view, store } from 'react-easy-state'
import { Cards, Card } from './components/Card'
import StatItem from './components/StatItem'
import { init } from './lib/system-info'
import './App.css';

const data = store({
  network: {},
  device: {},
  browser: {},
  location: {},
  geo: {},
  graphics: {}
})

init(data)

class App extends Component {
  render() {
    console.log('render', data)
    console.log('ip', data.network.ip)
    if (!data) return null
    return (
      <div className="App">
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
            <StatItem
              label="Lat/Long"
              value={`${data.geo.lat}, ${data.geo.lon}`}
            />
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
      </div>
    );
  }
}

export default view(App);
