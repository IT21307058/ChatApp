import React, { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { useNavigate } from 'react-router-dom'

const Form = ({
    isSignInPage = true,
}) => {
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ""
        }),
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        console.log(data)

        e.preventDefault()
        const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login': 'register'}`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        if(res.status === 400){
            alert('Invalid Credentials')
        }else{
            const resData = await res.json()
            console.log(resData)
    
            if(resData.token){
                localStorage.setItem('user:token', resData.token)
                localStorage.setItem('user:detail',JSON.stringify(resData.user))
                navigate('/')
            }

        }
    }

    return (
        <div className='bg-light h-screen flex intems-center justify-center'>
            <div className='bg-white w-[600px] h-[800px] shadow-lg flex flex-col justify-center items-center'>
                <div className='text-4xl font-extrabold'>Welcome {isSignInPage && 'Back'}</div>
                <div className='text-xl font-light'>{isSignInPage ? 'Sign in to get explored' : 'Sign up to get started'}</div>
                <form className='flex flex-col items-center w-full' onSubmit={(e) => handleSubmit(e)}>
                    {!isSignInPage && <Input label='Full Name' name="name" placeholder='Enter your fullname' value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} />}
                    <Input label='Email Address' name="email" placeholder='Enter your Email Address' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    <Input label='Password' name="password" placeholder='Enter your Password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />

                    <Button label={isSignInPage ? 'Sign In' : 'Sign up'} type='submit'></Button>
                </form>
                <div>Already have and Account?<span className='text-primary cursor-pointer' onClick={() => navigate(`/users/${isSignInPage ? 'sign_up':'sign_in'}`)}>{isSignInPage ? 'Sign up' : 'Sign In'}</span></div>
            </div>
        </div>
    )
}

export default Form