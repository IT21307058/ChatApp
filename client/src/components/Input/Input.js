import React from 'react'

const Input = ({
    label = '',
    name = '',
    type = 'text',
    isRequired = true,
    placeholder = '',
    value='',
    onChange = () => {}
}) => {
    return (
        <div>
            <label for={name}>{label}</label>

            <input type={type} id={name} className='w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500' placeholder={placeholder} required={isRequired} 
              value={value} onChange={onChange}
            />
        </div>
    )
}

export default Input