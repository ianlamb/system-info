import React, { Component } from 'react'
import './index.css'

const TOAST_TTL = 5000

class Toasts extends Component {
  constructor(props) {
    super(props)

    this.toastCount = 0
    this.state = {
      toasts: []
    }
  }

  componentWillMount() {
    window.addEventListener('textcopied', e => {
      if (e.detail) {
        this.addToast(
          `Copied ${e.detail.name} "${e.detail.value}" to clip board.`
        )
      }
    })
  }

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
    return (
      <ul className="App-toasts">
        {this.state.toasts.map(toast => (
          <li className="App-toast" key={toast.id}>
            {toast.text}
          </li>
        ))}
      </ul>
    )
  }
}

export default Toasts
