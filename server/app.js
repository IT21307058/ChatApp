const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const express = require("express");

const Users = require("./model/User");
const Conversations = require("./model/Conversations");
const Messages = require("./model/Messages");

const app = express();
require("./db/connection")

const PORT = process.env.PORT || 8000;

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send("Hello")
})

app.post('/api/register', async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            res.status(400).send('Please fill all required fields')
        } else {
            const isAlreadyExists = await Users.findOne({ email });
            if (isAlreadyExists) {
                res.status(400).send('User Already exists')
            } else {
                const newUser = new Users({ fullName, email });
                bcryptjs.hash(password, 10, (err, hashedPassword) => {
                    newUser.set('password', hashedPassword);
                    newUser.save();
                    next();
                })
                return res.status(200).send('User registered successfully');
            }
        }
    } catch (error) {

    }
})

app.post('/api/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send('Please fill all required fields')
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send('User email or password is incorrect')
            } else {
                const validateUser = await bcryptjs.compare(password, user.password)
                if (!validateUser) {
                    res.status(400).send('User email or password is incorrect')
                } else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';

                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        next()
                    })
                    return res.status(200).send({ user: { email: user.email, fullName: user.fullName }, token: user.token });
                }
            }
        }
    } catch (error) {
        console.log(error, 'Error')
    }
})

app.post('/api/conversations', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const newConversations = new Conversations({ members: [senderId, receiverId] });
        await newConversations.save();
        res.status(200).send('Conversations created successfully');
    } catch (error) {
        console.log(error, "Error")
    }
})

app.get('/api/conversations/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversations.find({ members: { $in: [userId] } });
        const conversationsUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await Users.findById(receiverId);
            return { user: { emai: user.email, fullName: user.fullName }, conversationId: conversation._id }
        }))

        res.status(200).json(await conversationsUserData);
    } catch (error) {
        console.log(error, "Error")
    }
})

app.post('/api/message', async (req, res) => {
    try {
        const { consversationId, senderId, message, receiverId='' } = req.body;
        if (!senderId || !message) return res.status(400).json('Please fill all required fields')

        if (!consversationId && receiverId) {
            const newConversation = new Conversations({ members: [senderId, receiverId] });
            await newConversation.save();
            const newMessage = new Messages({ consversationId : newConversation._id, senderId, message });
            await newMessage.save();
            return res.status(200).send('Message sent successfully')
        }else if(!consversationId && !receiverId){
            res.status(400).send('Please fill all required fields')
        }
        const newMessage = new Messages({ consversationId, senderId, message });
        await newMessage.save();
        res.status(200).send('Message sent successfully')

    } catch (error) {
        console.log(error, 'Error')
    }
})

app.get('/api/message/:consversationId', async (req, res) => {
    try {
        const consversationId = req.params.consversationId;
        if (consversationId === 'new') return res.status(200).json([])
        const messages = await Messages.find({ consversationId });
        const messagesUserData = Promise.all(messages.map(async (message) => {
            const user = await Users.findById(message.senderId);
            return { user: { emai: user.email, fullName: user.fullName }, message: message.message }
        }))

        res.status(200).json(await messagesUserData);
    } catch (error) {
        console.log(error, "Error")
    }
})

app.get('/api/users', async (req, res) => {
    try {
        const users = await Users.find();
        const userData = Promise.all(users.map(async (user) => {
            return { user: { emai: user.email, fullName: user.fullName }, userId: user._id }
        }))

        res.status(200).json(await userData);
    } catch (error) {
        console.log(error, "Error")
    }
})

app.listen(PORT, () => {
    console.log(`Server start at port no ${PORT}`)
})