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

const orderRoutes = Router()

orderRoutes.route('/create-payment-intent').post(createPaymentIntent)
orderRoutes.route('/create').post(verifyAccessToken, authorizeRoles([UserRole.BUYER]), createOrder)
orderRoutes.route('/:id').get(verifyAccessToken, authorizeRoles([UserRole.BUYER, UserRole.SELLER]), getOrderDetail)
orderRoutes
  .route('/:role/user')
  .get(verifyAccessToken, authorizeRoles([UserRole.SELLER, UserRole.BUYER]), getAllOrderByUser)
orderRoutes
  .route('/update')
  .put(
    verifyAccessToken,
    authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.SELLER, UserRole.BUYER]),
    updateOrderStatus
  )
orderRoutes.route('/').get(verifyAccessToken, authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]), getAllOrder)

export default orderRoutes
