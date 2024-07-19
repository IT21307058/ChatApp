import React, { useEffect, useState } from 'react'
import Input from '../../components/Input/Input'

const Dashboard = () => {

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const resData = await res.json()
            setConversation(resData)
            // console.log(resData)
        }
        fetchConversations()
    })

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    // console.log(user)
    const [conversations, setConversation] = useState([])
    const [messages, setMessage] = useState([])
    const [message, setMessages] = useState('')
    const [users, setUsers] = useState([])

    const fetchMessages = async (conversationId, receiver) => {
		const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const resData = await res.json()
		setMessages({ messages: resData, receiver, conversationId })
	}

    const sendMessage = async (e) => {
        const res = await fetch(`http://localhost:8000/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversations: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })
        })

        const resData = await res.json()
        // setMessages('')
        console.log(resData)
    }

    useEffect(() => {
        const fetchUsers = async() => {
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const resData = await res.json();
            setUsers(resData)
            console.log(resData)
        }
        fetchUsers()
    }, [])

    return (
        <div className='w-screen flex'>
            <div className='w-[25%] h-screen bg-secondary'>
                <div className='flex justify-center items-center my-8'>
                    <div className='border border-primary p-[2px] rounded-full'>
                        <img src="" width={75} height={75} />
                    </div>
                    <div className='ml-8'>
                        <h3 className='text-2xl'>{user?.fullName}</h3>
                        <p className='text-lg font-light'>My Account</p>
                    </div>
                </div>
                <hr />
                <div className='ml-14 mt-18'>
                    <div>Messages</div>
                    <div>
                        {
                            conversations.map(({ conversationId, user }) => {
                                // console.log(user)
                                // console.log("data", conversation)
                                return (
                                    <div className='flex items-center py-8 border-b border-b-gray-300' onClick={() => fetchMessages(conversationId, user)}>
                                        <div>
                                            {/* <img src={img} width={50} height={50} /> */}
                                        </div>
                                        <div className='ml-8'>
                                            <h3 className='text-lg'>{user?.fullName}</h3>
                                            <p className='text-lg font-light'>{user.emai}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
                <div className='w-[75%] bg-secondary h-[80px] mt-14 rounded-full flex items-center px-14'>
                    <div className='ml-6 mr-auto'>
                        <h3 className='text-lg'>{user?.fullName}</h3>
                        <p className='text-sm font-light text-gray-600'>online</p>
                    </div>
                </div>

                <div className='w-[75%] border w-full overflow-scroll border-b'>
                    <div className='h-[1200px] px-14'>
                        {
                            messages?.messages?.length > 0 ?
                                messages?.messages?.map(({ message, user: { id } = {} }) => {
                                    if (id === user?.id) {
                                        return (
                                            <div className='max-w-[40%] bg-primary rounded-b-xl rounded-tl-xl ml-auto p-4 mb-text-white mb-6'>
                                                {message}
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className='max-w-[40%] bg-secondary rounded-b-xl rounded-tr-xl p-4 mb-6'>
                                                {message}
                                            </div>
                                        )
                                    }
                                }) : <div> No Message</div>
                        }
                    </div>
                </div>
                {
                    messages?.receiver?.fullName &&
                    <div className='p-14 w-full flex items-center'>
                        <Input value={message} onChange={(e) => setMessages(e.target.value)} />
                        <div className='bg-primary mr-6' onClick={() => sendMessage()}>Send</div>
                        <div className='bg-primary'>Plus</div>
                    </div>
                }
            </div>
            <div className='w-[25%] h-screenbg-light'>
                <div className=''>People</div>
                <div>
                    {
                        users.map(({ userId, user }) => {
                            // console.log(user)
                            // console.log("data", conversation)
                            return (
                                <div className='flex items-center py-8 border-b border-b-gray-300'>
                                    <div className='ml-8' onClick={() => fetchMessages("new", user)}>
                                        <h3 className='text-lg'>{user?.fullName}</h3>
                                        <p className='text-lg font-light'>{user.emai}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard