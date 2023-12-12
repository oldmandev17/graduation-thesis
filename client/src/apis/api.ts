import { CategoryStatus } from 'modules/category'
import { axiosFormData, axiosJson } from './axios'

function getAllCategory(
  page: number | null,
  limit: number | null,
  status: CategoryStatus | null,
  keyword: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null,
  parent: string,
  level: number | undefined,
  accessToken: string | undefined
) {
  let url = `/category?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  if (parent) url += `&&parent=${parent}`
  if (level) url += `&&level=${level}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function createGig(data: any, accessToken: string | undefined) {
  const url = '/gig/create'
  return axiosFormData.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateGig(id: string, data: any, accessToken: string | undefined) {
  const url = `/gig/update/${id}`
  return axiosFormData.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getCategoryDetailBySlug(slug: string | undefined) {
  const url = `/category/slug/${slug}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function getGigDetailById(id: string | undefined, accessToken: string | undefined) {
  const url = `/gig/id/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getGigDetailBySlug(slug: string | undefined) {
  const url = `/gig/slug/${slug}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function getAllNotification(accessToken: string | undefined) {
  const url = '/auth/notification'
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function seenNotification(id: string, accessToken: string | undefined) {
  const url = `/auth/seen-notification/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateProfile(data: any, accessToken: string | undefined) {
  const url = '/auth/update-profile'
  return axiosFormData.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getProfile(accessToken: string | undefined) {
  const url = '/auth/me'
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export {
  getAllCategory,
  createGig,
  getCategoryDetailBySlug,
  getGigDetailById,
  updateGig,
  getGigDetailBySlug,
  getAllNotification,
  updateProfile,
  seenNotification,
  getProfile
}
