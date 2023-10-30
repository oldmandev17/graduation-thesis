import { LogMethod, LogName, LogStatus } from 'modules/log'
import { CategoryStatus } from 'modules/category'
import { axiosJson } from './axios'

function getAllLog(
  page: number,
  limit: number,
  status: LogStatus | null,
  method: LogMethod | null,
  name: LogName | null,
  sortBy: string,
  orderBy: string,
  startDay: Date,
  endDay: Date,
  accessToken: string | undefined
) {
  let url = `/log?createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}&&sortBy=${sortBy}&&orderBy=${orderBy}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (method) url += `&&method=${method}`
  if (name) url += `&&name=${name}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getLogDetail(id: string, accessToken: string | undefined) {
  const url = `/log/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function deleteLog(arrIds: Array<string>, accessToken: string | undefined) {
  const url = '/log'
  return axiosJson.delete(url, {
    data: [...arrIds],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllCategory(
  page: number,
  limit: number,
  status: CategoryStatus | null,
  keyword: string,
  sortBy: string,
  orderBy: string,
  startDay: Date,
  endDay: Date,
  accessToken: string | undefined
) {
  let url = `/category?createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}&&sortBy=${sortBy}&&orderBy=${orderBy}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function deleteCategory(arrIds: Array<string>, accessToken: string | undefined) {
  const url = '/category'
  return axiosJson.delete(url, {
    data: [...arrIds],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllUser(status: LogStatus) {
  let url = '/api/log'
  if (status) url += `status=${status}`
  return axiosJson.get(url)
}

export { getAllLog, getAllUser, deleteLog, getAllCategory, deleteCategory, getLogDetail }
