import { NextFunction, Request, Response, Router } from 'express'
import passport from 'passport'
import {
  createUser,
  getAllUser,
  getProfile,
  getUserDetail,
  login,
  logout,
  refreshToken,
  register,
  updateUserStatus,
  verifyEmail
} from 'src/controllers/authController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const authRouter = Router()

authRouter.route('/register').post(register)
authRouter.route('/verify/:userId/:verificationString').get(verifyEmail)
authRouter.route('/login').post(login)
authRouter.route('/refresh-token').post(refreshToken)
authRouter.route('/logout/:refreshToken').delete(logout)
authRouter.route('/me').get(verifyAccessToken, getProfile)
authRouter.route('/admin').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllUser)
authRouter.route('/admin/create-user').post(verifyAccessToken, authorizeRoles([UserRole.ADMIN]), createUser)
authRouter
  .route('/admin/update-user')
  .put(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), updateUserStatus)
authRouter.route('/admin/:id').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getUserDetail)
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
