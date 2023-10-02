import { NextFunction, Request, Response, Router } from 'express'
import passport from 'passport'
import { getProfile, login, logout, refreshToken, register, verifyEmail } from 'src/controllers/authControllers'
import { verifyAccessToken } from 'src/middlewares/jwtHelper'

const authRouter = Router()
// Register: .../auth/register with input req.body include name, email, password and confirmPassword field
authRouter.route('/register').post(register)
// Verify email: .../auth/verify/:userId/:uniqueString
authRouter.route('/verify/:userId/:verificationString').get(verifyEmail)
// Login: .../auth/login with input req.body include email and password field
authRouter.route('/login').post(login)
// Refresh token: .../auth/refresh-token with input req.body include refreshToken field
authRouter.route('/refresh-token').post(refreshToken)
// Logout: .../auth/logout with input req.body include refreshToken field
authRouter.route('/logout/:refreshToken').delete(logout)
// Get profile: .../auth/me with req.header include accessToken
authRouter.route('/me').get(verifyAccessToken, getProfile)
// Return auth router

// localhost:5000/api/auth/google
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

authRouter.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err: any, profile: any) => {
      req.user = profile
      next()
    })(req, res, next)
  },
  (req: any, res: any) => {
    res.redirect(`${process.env.URL_CLIENT}/login-success/${req.user?.id}/${req.user.tokenLogin}`)
  }
)

authRouter.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }))

authRouter.get(
  '/facebook/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', (err: any, profile: any) => {
      req.user = profile
      next()
    })(req, res, next)
  },
  (req: any, res: any) => {
    res.redirect(`${process.env.URL_CLIENT}/login-success/${req.user?.id}/${req.user.tokenLogin}`)
  }
)

export default authRouter
