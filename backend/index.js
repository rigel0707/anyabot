import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { Configuration, OpenAIApi } from 'openai'

import { userRouter } from './routes/users.js'
import { chatRouter } from './routes/chats.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 8000
const uri = process.env.DB_URI

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/auth', userRouter)
app.use('/chat', chatRouter)

mongoose.connect(uri)

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
