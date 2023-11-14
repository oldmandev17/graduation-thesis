import Joi from 'joi'
import { CategoryStatus } from 'src/models/categoryModel'
import { GigPackageType, GigStatus } from 'src/models/gigModel'
import { UserGender, UserRole, UserStatus } from 'src/models/userModel'

export const authRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
  confirmPassword: Joi.ref('password')
})

export const authLoginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/))
})

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid(...Object.values(CategoryStatus)),
  image: Joi.binary(),
  features: Joi.array().items(Joi.string())
})

export const categoryStatusSchema = Joi.array().items(Joi.string())

export const logDeleteSchema = Joi.array().items(Joi.string())

export const userCreateSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  role: Joi.array().items(Joi.string().valid(...Object.values(UserRole))),
  status: Joi.string().valid(...Object.values(UserStatus))
})

export const userDeleteSchema = Joi.array().items(Joi.string())

export const userStatusSchema = Joi.array().items(Joi.string())

export const categoryDeleteSchema = Joi.array().items(Joi.string())

export const userUpdateSchema = Joi.object({
  name: Joi.string(),
  birthday: Joi.date(),
  gender: Joi.string()
    .allow(null)
    .valid(...Object.values(UserGender)),
  phone: Joi.string()
    .allow(null)
    .regex(/^[0-9]{10}$/),
  password: Joi.string()
    .allow(null)
    .pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
  confirmPassword: Joi.ref('password'),
  role: Joi.array().items(
    Joi.string()
      .allow(null)
      .valid(...Object.values(UserRole))
  ),
  status: Joi.string()
    .allow(null)
    .valid(...Object.values(UserStatus)),
  avatar: Joi.binary()
})

export const authForgotPasswordSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

export const authSendMailSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  ids: Joi.array().items(Joi.string()).min(1)
})

export const authResetPasswordSchema = Joi.object({
  userId: Joi.string().required(),
  resetString: Joi.string().required(),
  password: Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)),
  confirmPassword: Joi.ref('password')
})

export const gigSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  packages: Joi.array().items(
    Joi.object({
      type: Joi.string().valid(...Object.values(GigPackageType)),
      name: Joi.string(),
      description: Joi.string(),
      revisions: Joi.number(),
      features: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          status: Joi.boolean()
        })
      ),
      deliveryTime: Joi.number(),
      price: Joi.number()
    })
  ),
  FAQs: Joi.array().items(
    Joi.object({
      question: Joi.string(),
      answer: Joi.string()
    })
  ),
  images: Joi.array().items(Joi.binary()),
  category: Joi.string(),
  status: Joi.string()
    .valid(...Object.values(GigStatus))
    .optional()
})

export const gigStatusSchema = Joi.array().items(Joi.string())

export const gigDeleteSchema = Joi.array().items(Joi.string())

export const orderSchema = Joi.object({
  name: Joi.string()
})

export const orderStatusSchema = Joi.array().items(Joi.string())

export const orderDeleteSchema = Joi.array().items(Joi.string())
