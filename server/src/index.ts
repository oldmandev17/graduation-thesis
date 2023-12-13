import cros from 'cors'
import express, { Request, Response } from 'express'
import httpError from 'http-errors'
import morgan from 'morgan'
import { Server } from 'socket.io'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import authRouter from './routes/authRoute'
import categoryRoutes from './routes/categoryRoute'
import gigRoutes from './routes/gigRoute'
import logRoutes from './routes/logRoute'
import messageRouter from './routes/messageRoute'

// Use redis cluter
require('src/helpers/initRedis')
// Use mongo database
require('src/helpers/initMongodb')
// Generate key
// require('src/utils/generateKey')
// Use passport
require('src/helpers/initPassport')
// Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Freelancer',
      description: 'Api for website Freelancer',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>'
        }
      }
    }
  },
  // looks for configuration in specified directories
  apis: ['src/routes/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)
// Create app
const app = express()
// Use app service
app.use(
  cros({
    credentials: true
  })
)

app.use('/uploads', express.static('./uploads'))
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/auth', authRouter)
app.use('/api/category', categoryRoutes)
app.use('/api/log', logRoutes)
app.use('/api/gig', gigRoutes)
app.use('/api/message', messageRouter)
// Swagger Page
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// Documentation in JSON format
app.get('/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use(express.urlencoded({ extended: true }))

app.use(async (req, res, next) => {
  next(httpError.NotFound())
})
app.use(
  (
    err: { status: any; message: any },
    req: any,
    res: { status: (arg0: any) => void; send: (arg0: { error: { status: any; message: any } }) => void },
    next: any
  ) => {
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message
      }
    })
  }
)

// Application port
const PORT = process.env.PORT || 5000
// Application running
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT} in ${process.env.NODE_ENV} mode.`)
})

const globalAny: any = global

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

globalAny.onlineUsers = new Map()

io.on('connection', (socket) => {
  globalAny.chatSocket = socket

  socket.on('add-user', (userId) => {
    globalAny.onlineUsers.set(userId, socket.id)
  })

  socket.on('send-msg', (data: any) => {
    const sendUserSocket = globalAny.onlineUsers.get(data.to)

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', {
        from: data.from,
        message: data.message
      })
    }
  })
})
