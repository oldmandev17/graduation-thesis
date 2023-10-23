import fs from 'fs'
import multer from 'multer'

export const upload = (folder: string) => {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        if (!fs.existsSync(`uploads/${folder}`)) {
          fs.mkdirSync(`uploads/${folder}`, { recursive: true })
        }
        cb(null, `uploads/${folder}`)
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, `${folder}-${uniqueSuffix}-${file.originalname}`)
      }
    })
  })
}
