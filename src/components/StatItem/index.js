import React from 'react'
import classnames from 'classnames'
import './styles.css'

const CHAR_SIZE = 8

const StatItem = ({ label, value, copyable }) => {
  const input = React.createRef()
  let copy = e => {
    if (input && input.current) {
      input.current.select()
      document.execCommand('copy')
      input.current.blur()
      window.dispatchEvent(
        new CustomEvent('textcopied', {
          detail: {
            name: e.currentTarget.dataset.name,
            value: input.current.value
          }
        })
      )
    }
  }
  return (
    <div className={classnames('StatItem', { copyable: copyable })}>
      <div className="StatItem-label">{label}</div>
      <div
        className="StatItem-value"
        data-name={label}
        onClick={copy}
        title="Copy"
      >
        {copyable ? (
          <React.Fragment>
            <input
              type="text"
              className="StatItem-input"
              ref={input}
              value={value || '--'}
              style={{
                width: value ? `${(value.length + 1) * CHAR_SIZE}px` : '0'
              }}
              readOnly
            />
            <button className="StatItem-copy-btn">
              <svg className="svg-icon" viewBox="0 0 20 20">
                <path d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z" />
              </svg>
            </button>
          </React.Fragment>
        ) : (
          value || '--'
        )}
      </div>
    </div>
  )
}

export default StatItem
