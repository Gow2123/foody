import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='errorSection'>
      <h1>404</h1>
      <h3>Page Not Found</h3>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/">
        Return to Dashboard
      </Link>
    </div>
  )
}

export default NotFound