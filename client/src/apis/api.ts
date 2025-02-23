import { SortFilter } from 'assets/data'
import { CategoryStatus } from 'modules/category'
import { GigStatus } from 'modules/gig'
import { OrderStatus } from 'modules/order'
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

function getAllGigByUser(
  accessToken: string | undefined,
  status: GigStatus | undefined,
  sortBy: string,
  orderBy: string
) {
  let url = `/gig/user?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (status) url += `&&status=${status}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateGigStatus(
  arrIds: Array<string>,
  status: GigStatus,
  reason: string | undefined,
  accessToken: string | undefined
) {
  const url = `/gig/update?status=${status}`
  const data: any = {}
  data.ids = arrIds
  if (reason) data.reason = reason
  return axiosJson.put(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllLandingGigByUser(accessToken: string | undefined) {
  const url = '/gig/landing'
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function addOrRemoveWishlist(accessToken: string | undefined, id: string) {
  const url = `/auth/wishlist/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllGig(
  page: number | null,
  limit: number | null,
  status: GigStatus | null,
  keyword: string,
  creator: string,
  categoryId: string,
  sortBy: string,
  orderBy: string,
  startDay: Date | null,
  endDay: Date | null
) {
  let url = `/gig?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (startDay && endDay) url += `&&createdAt[gte]=${startDay}&&createdAt[lt]=${endDay}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  if (creator) url += `&&creator=${creator}`
  if (categoryId) url += `&&categoryId=${categoryId}`
  return axiosJson.get(url)
}

function getAllGigFilter(
  page: number | null,
  limit: number | null,
  status: GigStatus | null,
  keyword: string | null,
  category: string | undefined,
  budget: number | null,
  time: number | null,
  sort: SortFilter
) {
  let url = `/gig/filter?status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  if (page && limit) url += `&&page=${page}&&limit=${limit}`
  if (budget) url += `&&budget=${budget}`
  if (category) url += `&&category=${category}`
  if (time !== -1) url += `&&time=${time}`
  if (sort) url += `&&sort=${sort}`
  return axiosJson.get(url)
}

function createOrder(data: any, accessToken: string | undefined) {
  const url = '/order/create'
  return axiosJson.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getOrderDetail(id: string | undefined, accessToken: string | undefined) {
  const url = `/order/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getAllOrderByUser(
  accessToken: string | undefined,
  status: OrderStatus | undefined,
  keyword: string,
  sortBy: string,
  orderBy: string,
  role: string
) {
  let url = `/order/${role}/user?sortBy=${sortBy}&&orderBy=${orderBy}`
  if (status) url += `&&status=${status}`
  if (keyword) url += `&&keyword=${keyword}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function updateOrderStatus(
  arrIds: Array<string>,
  status: OrderStatus,
  reason: string | undefined,
  accessToken: string | undefined
) {
  const url = `/order/update?status=${status}`
  const data: any = {}
  data.ids = arrIds
  if (reason) data.reason = reason
  return axiosJson.put(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })
}

function getUserById(id: string | undefined) {
  const url = `/auth/user/${id}`
  return axiosJson.get(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function createReview(id: string, data: any, accessToken: string | undefined) {
  const url = `/gig/review/${id}/create`
  return axiosJson.post(url, data, {
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
  getProfile,
  getAllGigByUser,
  updateGigStatus,
  getAllLandingGigByUser,
  addOrRemoveWishlist,
  getAllGig,
  getAllGigFilter,
  createOrder,
  getOrderDetail,
  getAllOrderByUser,
  updateOrderStatus,
  getUserById,
  createReview
}
