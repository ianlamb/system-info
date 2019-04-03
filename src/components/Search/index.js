import React, { Component } from 'react'
import './index.css'

class Toast extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="Search">
        <input type="text" className="Search-input" />
      </div>
    )
  }
}

export default Toast
