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

        <div className="App-footer">
          <div>
            <svg class="svg-icon" viewBox="0 0 20 20">
              <path d="M10,6.978c-1.666,0-3.022,1.356-3.022,3.022S8.334,13.022,10,13.022s3.022-1.356,3.022-3.022S11.666,6.978,10,6.978M10,12.267c-1.25,0-2.267-1.017-2.267-2.267c0-1.25,1.016-2.267,2.267-2.267c1.251,0,2.267,1.016,2.267,2.267C12.267,11.25,11.251,12.267,10,12.267 M18.391,9.733l-1.624-1.639C14.966,6.279,12.563,5.278,10,5.278S5.034,6.279,3.234,8.094L1.609,9.733c-0.146,0.147-0.146,0.386,0,0.533l1.625,1.639c1.8,1.815,4.203,2.816,6.766,2.816s4.966-1.001,6.767-2.816l1.624-1.639C18.536,10.119,18.536,9.881,18.391,9.733 M16.229,11.373c-1.656,1.672-3.868,2.594-6.229,2.594s-4.573-0.922-6.23-2.594L2.41,10l1.36-1.374C5.427,6.955,7.639,6.033,10,6.033s4.573,0.922,6.229,2.593L17.59,10L16.229,11.373z"></path>
            </svg>
          </div>
          <div style={{marginBottom:'10px'}}>This website does not collect or store any information about your device.</div>
          <a href="https://github.com/ianlamb/device-probe">View Source</a>
        </div>
      </div>
    );
  }
}

export default view(App);
