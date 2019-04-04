import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './index.css'

class Search extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      active: false
    }

    this.input = React.createRef()

    this.handleChange = this.handleChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  static propTypes = {
    store: PropTypes.object
  }

  handleChange(e) {
    const { value } = e.target
    this.props.store.search = value
    this.setState({
      value
    })
  }

  handleFocus() {
    this.setState({
      active: true
    })
  }

  handleBlur() {
    this.setState({
      active: false
    })
  }

  componentDidMount() {
    this.input.current.focus()
    window.addEventListener('blur', () => {
      this.input.current.blur()
    })
  }

  render() {
    const { value, active } = this.state
    return (
      <div className={classnames('Search', { active: active })}>
        <input
          type="text"
          className="Search-input"
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          value={value}
          placeholder="Search..."
          ref={this.input}
        />
      </div>
    )
  }
}

export default Search
