import React from 'react'
import './styles.css'

export const Cards = ({ children }) => <div className="Cards">{children}</div>

export const Card = ({ children, title }) => (
  <section className="Card">
    {title ? <h2 className="Card-title">{title}</h2> : null}
    <div className="Card-content">{children}</div>
  </section>
)
