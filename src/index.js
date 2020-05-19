import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import ErrorBoundary from 'react-error-boundary'

// import './vendor/modernizr'
import './shims/webrtc-adapter'
import './polyfills/String.prototype.padStart'

import './index.css'
import './svg-icons.css'

const FallbackComponent = ({ componentStack, error }) => (
  <h1 className="App-error">It's borked, sorry :(</h1>
)

ReactDOM.render(
  <ErrorBoundary FallbackComponent={FallbackComponent}>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
