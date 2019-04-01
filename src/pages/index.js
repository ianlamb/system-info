import React from 'react'
import { view, store } from 'react-easy-state'

import Layout from '../components/layout'
import { Cards, Card } from '../components/Card'
import StatItem from '../components/StatItem'
import { init } from '../lib/system-info'

class IndexPage extends React.Component {
  componentDidMount() {
    init().then(() => {
      this.info = store()
      console.log(this.info)
    })
  }

  render() {
    const {info} = this
    if (!info || typeof window === 'undefined') {
      return null
    }
    console.log(info)
    return (
      <Layout>
        <Cards>
          <Card title="Network">
            <StatItem
              label="Public IP"
              value={info.network.publicIp}
              copyable={true}
            />
            <StatItem
              label="Local IP"
              value={info.network.localIp}
              copyable={true}
            />
            <StatItem label="Connection" value={info.network.type} />
            <StatItem label="Downlink" value={info.network.downlink} />
            <StatItem label="RTT Estimate" value={info.network.rtt} />
            <StatItem label="ISP" value={info.network.isp} />
          </Card>
          <Card title="Browser">
            <StatItem
              label="Browser"
              value={`${info.browser.name} ${info.browser.version}`}
            />
            <StatItem label="Engine" value={info.browser.engine} />
            <StatItem label="Language" value={info.browser.language} />
            <StatItem label="Cookies" value={info.browser.cookies} />
            <StatItem label="User Agent" value={info.browser.userAgent} />
          </Card>
          <Card title="Device">
            <StatItem label="Device" value={info.device.name} />
            <StatItem label="Operating System" value={info.device.os} />
            <StatItem label="Battery Level" value={info.device.battery} />
            <StatItem label="System Time" value={info.device.systemTime} />
            <StatItem label="Timezone" value={info.geo.timezone} />
            <StatItem label="Location" value={info.geo.location} />
            <StatItem
              label="Lat/Long"
              value={`${info.geo.lat}, ${info.geo.lon}`}
            />
          </Card>
          <Card title="Graphics">
            <StatItem label="Resolution" value={info.graphics.resolution} />
            <StatItem label="Aspect Ratio" value={info.graphics.aspectRatio} />
            <StatItem label="Color Depth" value={info.graphics.colorDepth} />
            <StatItem
              label="Screen Orientation"
              value={info.graphics.screenOrientation}
            />
            <StatItem label="Video Card" value={info.graphics.gpu} />
          </Card>
        </Cards>
      </Layout>
    )
  }
}

export default view(IndexPage)
