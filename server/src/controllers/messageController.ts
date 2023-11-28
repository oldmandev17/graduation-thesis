import Message, { IMessage, MessageStatus, MessageType } from 'src/models/messageModel'
import httpError from 'http-errors'
import { NextFunction, Request, Response } from 'express'
import { messageSchema } from 'src/utils/validationSchema'
import User from 'src/models/userModel'

interface MessageQuery {
  from?: string
  to?: string
}

export async function addMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await messageSchema.validateAsync(req.body)
    const fromExist = await User.findOne({ _id: result.from })
    if (!fromExist) throw httpError.NotFound()
    const toExist = await User.findOne({ _id: result.to })
    if (!toExist) throw httpError.NotFound()
    const globalAny: any = global
    const getUser = globalAny.onlineUsers.get(result.to)
    const message = await Message.create({
      message: result.message,
      sender: result.from,
      type: MessageType.TEXT,
      receiver: result.to,
      status: getUser ? MessageStatus.DELIVERED : MessageStatus.SENT
    })
    res.status(201).json({ message })
  } catch (error: any) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.params
    const fromExist = await User.findOne({ _id: from })
    if (!fromExist) throw httpError.NotFound()
    const toExist = await User.findOne({ _id: to })
    if (!toExist) throw httpError.NotFound()
    const messages = await Message.find({
      $or: [
        {
          sender: from,
          receiver: to
        },
        {
          sender: to,
          receiver: from
        }
      ]
    })
      .populate({ path: 'sender', select: '_id' })
      .populate({ path: 'receiver', select: '_id' })
      .sort({ createdAt: 'asc' })

    const unreadMessages: string[] = []
    messages.forEach((message: IMessage, index: number) => {
      if (message.status !== MessageStatus.READ && message.sender._id === to) {
        messages[index].status = MessageStatus.READ
        unreadMessages.push(message._id)
      }
    })

    await Message.updateMany({ _id: { $in: unreadMessages } }, { $set: { status: MessageStatus.READ } })

    return res.status(200).json({ messages })
  } catch (error) {
    next(error)
  }
}

export async function addImageMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File
    const { from, to } = req.query as unknown as MessageQuery
    if (!from || !to || !file) throw httpError.NotAcceptable()
    const fromExist = await User.findOne({ _id: from })
    if (!fromExist) throw httpError.NotFound()
    const toExist = await User.findOne({ _id: to })
    if (!toExist) throw httpError.NotFound()
    const globalAny: any = global
    const getUser = globalAny.onlineUsers.get(to)
    const message = await Message.create({
      message: file.path,
      sender: from,
      receiver: to,
      type: MessageType.IMAGE,
      status: getUser ? MessageStatus.DELIVERED : MessageStatus.SENT
    })
    return res.status(201).json({ message })
  } catch (error) {
    next(error)
  }
}
