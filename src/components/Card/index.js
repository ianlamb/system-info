import React from 'react'
import './styles.css'

export const Cards = ({ children }) => <div className="Cards">{children}</div>

export const Card = ({ children, title }) => (
  <div className="Card">
    {title ? <div className="Card-title">{title}</div> : null}
    <div className="Card-content">{children}</div>
  </div>
)
