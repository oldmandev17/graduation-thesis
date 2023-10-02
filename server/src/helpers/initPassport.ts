import { PrismaClient } from '@prisma/client'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { v4 } from 'uuid'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/api/auth/google/callback'
    },
    async function (accessToken: string, refreshToken: string, profile: any, cb: any) {
      try {
        if (profile?.id) {
          const prisma = new PrismaClient()
          const userExist = await prisma.user.findMany({
            where: {
              email: profile.emails[0]?.value,
              provider: 'gmail'
            }
          })

          if (userExist.length === 0) {
            await prisma.user.create({
              data: {
                name: profile?.displayName,
                email: profile?.emails[0]?.value,
                avatar: profile?.photos[0]?.value,  
                provider: 'gmail',
                verify: profile?.emails[0]?.verified,
                role: [profile?.emails[0]?.verified ? 'buyer' : 'none']
              }
            })
          }
        }
      } catch (error) {
        console.log('🚀 ~ file: initPassport.ts:22 ~ error:', error)
      }
      return cb(null, profile)
    }
  )
)
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['email', 'photos', 'id', 'displayName']
    },
    async function (accessToken: string, refreshToken: string, profile: any, cb: any) {
      const tokenLogin = v4()
      profile.tokenLogin = tokenLogin
      try {
        if (profile?.id) {
          console.log('🚀 ~ file: initPassport.ts:42 ~ profile:', profile)
        }
      } catch (error) {
        console.log('🚀 ~ file: initPassport.ts:41 ~ error:', error)
      }
      return cb(null, profile)
    }
  )
)
