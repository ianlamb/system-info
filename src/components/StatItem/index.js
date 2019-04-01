import React from 'react'
import classnames from 'classnames'
import './styles.css'

const StatItem = ({ label, value, copyable }) => {
  const input = React.createRef()
  const copy = () => {
    if (input) {
      input.current.select()
      document.execCommand('copy')
      input.current.blur()
    }
  }
  return (
    <div className={classnames('StatItem', { copyable: copyable })}>
      <div className="StatItem-label">{label}</div>
      {copyable ? (
        <input
          type="text"
          className="StatItem-input-value"
          ref={input}
          value={value}
        />
      ) : (
        <div className="StatItem-value">{value}</div>
      )}
      {copyable ? (
        <button className="StatItem-copy-btn" onClick={copy}>
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"></path>
          </svg>
        </button>
      ) : null}
    </div>
  )
}

export default StatItem
