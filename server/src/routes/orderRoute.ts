import { Router } from 'express'
import {
  createOrder,
  createPaymentIntent,
  getAllOrder,
  getAllOrderByUser,
  getOrderDetail,
  updateOrderStatus
} from 'src/controllers/orderController'
import { authorizeRoles, verifyAccessToken } from 'src/middlewares/jwtHelper'
import { UserRole } from 'src/models/userModel'

const orderRouter = Router()

orderRouter.route('/create-payment-intent').post(createPaymentIntent)
orderRouter.route('/create').post(verifyAccessToken, authorizeRoles([UserRole.BUYER]), createOrder)
orderRouter.route('/:id').get(verifyAccessToken, authorizeRoles([UserRole.BUYER, UserRole.SELLER]), getOrderDetail)
orderRouter
  .route('/:role/user')
  .get(verifyAccessToken, authorizeRoles([UserRole.SELLER, UserRole.BUYER]), getAllOrderByUser)
orderRouter
  .route('/update')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER, UserRole.BUYER]),
    updateOrderStatus
  )
orderRouter.route('/').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllOrder)

export default orderRouter
