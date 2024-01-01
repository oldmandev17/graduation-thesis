import { CategoryStatus } from 'modules/category'
import { GigStatus } from 'modules/gig'
import { LogMethod, LogName, LogStatus } from 'modules/log'
import { OrderMethod, OrderStatus } from 'modules/order'
import { UserGender, UserProvider, UserRole, UserStatus } from 'modules/user'

const arrLogMethods = [
  {
    label: 'GET',
    value: LogMethod.GET
  },
  {
    label: 'POST',
    value: LogMethod.POST
  },
  {
    label: 'PUT',
    value: LogMethod.PUT
  },
  {
    label: 'DELETE',
    value: LogMethod.DELETE
  }
]

const arrLogStatus = [
  {
    label: 'SUCCESS',
    value: LogStatus.SUCCESS
  },
  {
    label: 'ERROR',
    value: LogStatus.ERROR
  }
]

const arrCategoryLevel = [
  {
    label: 'Level 1',
    value: 1
  },
  {
    label: 'Level 2',
    value: 2
  },
  {
    label: 'Level 3',
    value: 3
  }
]

const arrLogNames = [
  {
    label: 'CREATE_CATEGORY',
    value: LogName.CREATE_CATEGORY
  },
  {
    label: 'CREATE_USER',
    value: LogName.CREATE_USER
  },
  {
    label: 'REGISTER_USER',
    value: LogName.REGISTER_USER
  },
  {
    label: 'REQUEST_RESET_PASSWORD',
    value: LogName.REQUEST_RESET_PASSWORD
  },
  {
    label: 'RESET_PASSWORD',
    value: LogName.RESET_PASSWORD
  },
  {
    label: 'LOGIN_USER',
    value: LogName.LOGIN_USER
  },
  {
    label: 'LOGOUT_USER',
    value: LogName.LOGOUT_USER
  },
  {
    label: 'VERIFY_EMAIL_USER',
    value: LogName.VERIFY_EMAIL_USER
  },
  {
    label: 'UPDATE_CATEGORY',
    value: LogName.UPDATE_CATEGORY
  },
  {
    label: 'UPDATE_CATEGORY_STATUS',
    value: LogName.UPDATE_CATEGORY_STATUS
  },
  {
    label: 'UPDATE_USER',
    value: LogName.UPDATE_USER
  },
  {
    label: 'UPDATE_USER_BY_ADMIN',
    value: LogName.UPDATE_USER_BY_ADMIN
  },
  {
    label: 'DELETE_LOGS',
    value: LogName.DELETE_LOGS
  },
  {
    label: 'DELETE_USERS',
    value: LogName.DELETE_USERS
  },
  {
    label: 'DELETE_CATEGORIES',
    value: LogName.DELETE_CATEGORIES
  }
]

const arrLimits = [
  {
    label: 'Show 10',
    value: 10
  },
  {
    label: 'Show 20',
    value: 20
  },
  {
    label: 'Show 50',
    value: 50
  },
  {
    label: 'Show 100',
    value: 100
  },
  {
    label: 'Show 500',
    value: 500
  },
  {
    label: 'Show 1000',
    value: 1000
  }
]

const arrCategoryStatus = [
  {
    label: 'ACTIVE',
    value: CategoryStatus.ACTIVE
  },
  {
    label: 'INACTIVE',
    value: CategoryStatus.INACTIVE
  },
  {
    label: 'DELETED',
    value: CategoryStatus.DELETED
  }
]

const arrUserRole = [
  {
    label: 'NONE',
    value: UserRole.NONE
  },
  {
    label: 'BUYER',
    value: UserRole.BUYER
  },
  {
    label: 'REQUEST SELLER',
    value: UserRole.REQUEST_SELLER
  },
  {
    label: 'SELLER',
    value: UserRole.SELLER
  },
  {
    label: 'MANAGER',
    value: UserRole.MANAGER
  },
  {
    label: 'ADMIN',
    value: UserRole.ADMIN
  }
]

const arrUserGender = [
  {
    label: 'MALE',
    value: UserGender.MALE
  },
  {
    label: 'FEMALE',
    value: UserGender.FEMALE
  }
]

const arrUserProvider = [
  {
    label: 'EMAIL',
    value: UserProvider.EMAIL
  },
  {
    label: 'GOOGLE',
    value: UserProvider.GOOGLE
  }
]

const arrUserVerify = [
  {
    label: 'TRUE',
    value: 'true'
  },
  {
    label: 'FALSE',
    value: 'false'
  }
]

const arrUserStatus = [
  {
    label: 'ACTIVE',
    value: UserStatus.ACTIVE
  },
  {
    label: 'INACTIVE',
    value: UserStatus.INACTIVE
  },
  {
    label: 'DELETED',
    value: UserStatus.DELETED
  }
]

const arrGigStatus = [
  {
    label: 'ACTIVE',
    value: GigStatus.ACTIVE
  },
  {
    label: 'INACTIVE',
    value: GigStatus.INACTIVE
  },
  {
    label: 'BANNED',
    value: GigStatus.BANNED
  },
  {
    label: 'DELETED',
    value: GigStatus.DELETED
  },
  {
    label: 'WAITING',
    value: GigStatus.WAITING
  },
  {
    label: 'NONE',
    value: GigStatus.NONE
  }
]

const arrOrderStatus = [
  {
    label: 'PENDING',
    value: OrderStatus.PENDING
  },
  {
    label: 'PAID',
    value: OrderStatus.PAID
  },
  {
    label: 'CANCEL',
    value: OrderStatus.CANCEL
  },
  {
    label: 'ACCEPT',
    value: OrderStatus.ACCEPT
  },
  {
    label: 'COMPLETE',
    value: OrderStatus.COMPLETE
  },
  {
    label: 'BUYER COMFIRM',
    value: OrderStatus.BUYER_CONFIRM
  },
  {
    label: 'SELLER COMFIRM',
    value: OrderStatus.SELLER_CONFIRM
  },
  {
    label: 'ADMIN COMFIRM',
    value: OrderStatus.ADMIN_CONFIRM
  }
]

const arrOrderMethod = [
  {
    label: 'STRIPE',
    value: OrderMethod.STRIPE
  },
  {
    label: 'PAYPAL',
    value: OrderMethod.PAYPAL
  }
]

export {
  arrLimits,
  arrLogMethods,
  arrLogNames,
  arrLogStatus,
  arrCategoryLevel,
  arrCategoryStatus,
  arrUserRole,
  arrUserGender,
  arrUserProvider,
  arrUserVerify,
  arrUserStatus,
  arrGigStatus,
  arrOrderStatus,
  arrOrderMethod
}
