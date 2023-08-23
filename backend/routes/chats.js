import express from 'express'
import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import readline from 'readline'

import { ChatModel } from '../models/Chats.js'
import { UserModel } from '../models/Users.js'

dotenv.config()

const router = express.Router()

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.GPT_API_KEY,
  })
)

// const userInterface = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })

// userInterface.prompt()
// userInterface.on('line', async (input) => {
//   const res = await openai.createChatCompletion({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: input }],
//   })
//   console.log(res.data.choices[0].message.content)
// })
router.post('/ask', async (req, res) => {
  const { message } = req.body

  console.log(message)
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `${message}` }],
    })

    const result = {
      answer: completion.data.choices[0].message.content,
    }

    console.log(result)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'An error occurred' })
  }
})

router.post('/savechat', async (req, res) => {
  const { userId, message } = req.body

  try {
    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const chatDoc = await ChatModel.findOne({ userId })

    if (!chatDoc) {
      const newChat = new ChatModel({
        userId: userId,
        username: user.username,
        chat: [message],
      })
      await newChat.save()
    } else {
      chatDoc.chat.push(message)
      await chatDoc.save()
    }

    res.json({ message: 'Chat saved successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'An error occurred' })
  }
})

export { router as chatRouter }
