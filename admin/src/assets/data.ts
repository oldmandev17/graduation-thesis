import { LogMethod, LogName, LogStatus } from 'modules/log'

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

export { arrLogMethods, arrLogNames, arrLogStatus, arrLimits }
