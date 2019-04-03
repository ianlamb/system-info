import React, { Component } from 'react'
import './index.css'

class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      theme: 'light'
    }
  }

  componentWillMount() {
    this.loadThemePreference()
  }

  setDarkTheme() {
    document.body.classList.add('dark-theme')
    window.localStorage.setItem('theme', 'dark')
    this.setState({
      theme: 'dark'
    })
  }

  setLightTheme() {
    document.body.classList.remove('dark-theme')
    window.localStorage.removeItem('theme')
    this.setState({
      theme: 'light'
    })
  }

  loadThemePreference() {
    const theme = window.localStorage.getItem('theme')
    if (theme === 'dark') {
      this.setDarkTheme()
    }
  }

  switchTheme = () => {
    const theme = window.localStorage.getItem('theme')
    if (theme === 'dark') {
      this.setLightTheme()
    } else {
      this.setDarkTheme()
    }
  }

  render() {
    const { theme } = this.state
    return (
      <header className="Header">
        <div className="Header-left">
          <h1 className="Header-title">Device Probe</h1>
        </div>
        <div className="Header-right">
          <button
            className="Header-theme-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            onClick={this.switchTheme}
          />
        </div>
      </header>
    )
  }
}

export default Header
