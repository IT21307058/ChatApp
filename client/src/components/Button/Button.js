import React from 'react'

const Button = ({
    label = "Button",
    type = "button",
    disabled = false
}) => {
  return (
    <button type={type} disabled={disabled} className='px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-10'>
        {label}
    </button>
  )
}

export default Button