import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import User, { UserRole } from 'src/models/userModel'
import UserReset from 'src/models/userResetModel'
import UserVerification from 'src/models/userVerificationModel'
import { v4 } from 'uuid'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL as string,
    pass: process.env.AUTH_PASSWORD as string
  }
})

export const sendVerificationEmail = async (_id: string, email: string, res: any, next: any) => {
  try {
    const uniqueString = v4() + _id
    const saltRounds = 10
    const hashedUniqueString = (await bcrypt.hash(uniqueString, saltRounds)) as string

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Verify your email address to complete the signup and login into your account</p>.<p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
        process.env.URL_SERVER + '/api/auth/verify/' + _id + '/' + uniqueString
      }>here</a> to procced.</p>`
    }

    await UserVerification.deleteMany({
      user: _id
    })

    await UserVerification.create({
      user: _id,
      verificationString: hashedUniqueString,
      expiresAt: Date.now() + 21600000
    })

    await transporter.sendMail(mailOptions)

    res.sendStatus(200)
  } catch (error: any) {
    next(error)
  }
}

export const sendResetEmail = async (_id: string, email: string, res: any, next: any) => {
  try {
    const resetString = v4() + _id
    const saltRounds = 10
    const hashedResetString = (await bcrypt.hash(resetString, saltRounds)) as string

    await UserReset.deleteMany({
      user: _id
    })
    const user = await User.findOne({ _id })
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>We heard that your lost the password.</p><p>Don't worry, use the link below to reset it.</p><p>This link <b>expires in 60 minutes.</b></p><p>Press <a href=${
        [UserRole.ADMIN, UserRole.MANAGER].every((item) => user?.role.includes(item))
          ? process.env.URL_ADMIN
          : process.env.URL_CLIENT + '/auth/reset-password/' + _id + '/' + resetString
      }>here</a> to procced.</p>`
    }

    await UserReset.create({
      user: _id,
      resetString: hashedResetString,
      expiresAt: Date.now() + 3600000
    })

    await transporter.sendMail(mailOptions)

    res.sendStatus(200)
  } catch (error: any) {
    next(error)
  }
}

export const sendPasswordEmail = async (_id: string, email: string, password: string, res: any, next: any) => {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Send Password',
      html: `<p>Verify your email address to complete the signup and login into your account</p>.<p>Your password <b>${password}</b>.</p><p>Press <a href=${
        process.env.URL_ADMIN + '/auth/login'
      }>here</a> to login.</p>`
    }

    await transporter.sendMail(mailOptions)
    await User.updateOne(
      {
        _id
      },
      {
        verify: true,
        updatedAt: Date.now()
      }
    )

    res.sendStatus(200)
  } catch (error: any) {
    next(error)
  }
}
