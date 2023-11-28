import { Router } from 'express'
import { addImageMessage, addMessage, getMessages } from 'src/controllers/messageController'
import { upload } from 'src/utils/upload'

const messageRouter = Router()
messageRouter.post('/add-message', addMessage)
messageRouter.get('/get-messages/:from/:to', getMessages)
messageRouter.post('/add-image-message', upload('message').single('image'), addImageMessage)

export default messageRouter
