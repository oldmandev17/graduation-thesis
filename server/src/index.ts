import cros from 'cors'
import express from 'express'
import httpError from 'http-errors'
import morgan from 'morgan'
import authRouter from './routes/authRoutes'

// Use redis cluter
require('src/helpers/initRedis')
// Generate key
// require('src/utils/generateKey')
// Use passport
require('src/helpers/initPassport')
// Create app
const app = express()
// Use app service
app.use(
  cros({
    credentials: true
  })
)
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/auth', authRouter)
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
app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT} in ${process.env.NODE_ENV} mode.`)
})
