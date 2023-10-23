import mongoose from 'mongoose'

mongoose
  .connect(process.env.DB_LOCAL_URI as string, {
    dbName: process.env.DB_NAME
  })
  .then((con) => {
    console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
  })
  .catch((err) => {
    console.log(err.message)
  })

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database.')
})

mongoose.connection.on('error', (err) => {
  console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
