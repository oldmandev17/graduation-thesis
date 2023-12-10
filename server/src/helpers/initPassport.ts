import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { signAccessToken, signRefreshToken } from 'src/middlewares/jwtHelper'
import { NotificationType } from 'src/models/notificationModel'
import User, { UserProvider, UserRole, UserStatus } from 'src/models/userModel'
import { createNotification } from 'src/utils/notification'
import { v4 } from 'uuid'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/api/auth/google/callback'
    },
    async function (accessToken: string, refreshToken: string, profile: any, cb: any) {
      let access
      let refresh
      try {
        if (profile?.id) {
          const userExist = await User.findOne({
            email: profile.emails[0]?.value,
            provider: UserProvider.GOOGLE
          })
          if (!userExist) {
            const id = String(profile?.displayName).replace(/ /g, '')
            const newUser = await User.create({
              name: profile?.displayName,
              email: profile?.emails[0]?.value,
              avatar: profile?.photos[0]?.value,
              provider: UserProvider.GOOGLE,
              password: null,
              verify: profile?.emails[0]?.verified,
              role: [profile?.emails[0]?.verified ? UserRole.BUYER : UserRole.NONE],
              status: UserStatus.ACTIVE,
              id: id.charAt(0).toLowerCase() + id.slice(1)
            })
            await createNotification(
              null,
              'New Account Registration',
              `Just a heads up, we've received a new account registration from Customer ${newUser.name}`,
              NotificationType.ADMIN,
              null
            )
            access = await signAccessToken(String(newUser._id), newUser.role)
            refresh = await signRefreshToken(String(newUser._id))
          } else {
            access = await signAccessToken(String(userExist._id), userExist.role)
            refresh = await signRefreshToken(String(userExist._id))
          }
        }
      } catch (error) {
        console.log('🚀 ~ file: initPassport.ts:22 ~ error:', error)
      }
      return cb(null, { ...profile, access, refresh })
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
