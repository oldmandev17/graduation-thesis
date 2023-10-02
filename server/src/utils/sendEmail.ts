import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { v4 } from 'uuid'

// Create email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: process.env.AUTH_EMAIL,
    // pass: process.env.AUTH_PASSWORD
    user: 'nntam17052001@gmail.com',
    pass: 'bxkfwivzxpvvibgo'
  }
})
// Send email verification email register
export const sendVerificationEmail = async (id: string, email: string, res: any, next: any) => {
  try {
    const uniqueString = v4() + id
    const prisma = new PrismaClient()
    const saltRounds = 10
    const hashedUniqueString = (await bcrypt.hash(uniqueString, saltRounds)) as string

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Verify your email address to complete the signup and login into your account</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
        process.env.CURRENT_URL + 'auth/verify/' + id + '/' + uniqueString
      }>here</a> to procced</p>`
    }

    await prisma.userVerification.deleteMany({
      where: {
        userId: id
      }
    })

    await prisma.userVerification.create({
      data: {
        user: {
          connect: { id }
        },
        verificationString: hashedUniqueString,
        expiresAt: new Date(Date.now() + 21600000)
      }
    })

    await transporter.sendMail(mailOptions)

    res.status(200).send('Verification email sent.')
  } catch (error: any) {
    next(error)
  }
}
// Send email reset password
export const sendResetEmail = async (id: string, email: string, redirectUrl: string, res: any, next: any) => {
  try {
    const resetString = v4() + id
    const prisma = new PrismaClient()
    const saltRounds = 10
    const hashedResetString = (await bcrypt.hash(resetString, saltRounds)) as string

    await prisma.userReset.deleteMany({
      where: {
        userId: id
      }
    })

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Password Reset',
      html: `<p>We heard that your lost the password.</p><p>Don't worry, use the link below to reset it.</p><p>This link <b>expires in 60 minutes</b>.</p><p>Press <a href=${
        redirectUrl + '/' + id + '/' + resetString
      }>here</a> to procced.</p>`
    }

    await prisma.userReset.create({
      data: {
        user: {
          connect: { id }
        },
        resetString: hashedResetString,
        expiresAt: new Date(Date.now() + 3600000)
      }
    })

    await transporter.sendMail(mailOptions)

    res.status(200).send('Password reset email sent.')
  } catch (error: any) {
    next(error)
  }
}
