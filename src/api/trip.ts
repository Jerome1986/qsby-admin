import { request } from '@/utils/request.ts'
import type { TripTypeListPageResult, TripTypeStatus } from '@/types/Trip'
import type { AddResult, DelResult } from '@/types/Gobal'
import type { TripListPageResult } from '@/types/Trip'

/**
 * 设置行程分类
 * @param name - 分类名称
 * @param sort - 排序
 * @param status - 显示状态 'active' | 'disabled'
 */
export const tripSetType = (name: string, sort: number, status: TripTypeStatus) => {
  return request<AddResult>({
    method: 'POST',
    url: '/trip/setType',
    data: { name, sort, status },
  })
}

/**
 * 获取所有行程的类型
 */
export const getTripTypes = (pageNum: number, pageSize: number) => {
  return request<TripTypeListPageResult>({
    method: 'GET',
    url: '/trip/findAllTripTypes',
    params: { pageNum, pageSize },
  })
}

/**
 * 更新行程分类
 * @param tripTypeId - 行程分类ID
 * @param name - 分类名称
 * @param sort - 排序
 * @param status - 显示状态 'active' | 'disabled'
 */
export const tripUpdateType = (
  tripTypeId: string,
  name: string,
  sort: number,
  status: TripTypeStatus,
) => {
  return request({
    method: 'POST',
    url: '/trip/updateType',
    data: { tripTypeId, name, sort, status },
  })
}

/**
 * 删除指定行程分类
 * @param tripTypeId - 行程分类ID
 */
export const deleteTripType = (tripTypeId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/trip/delType',
    data: { tripTypeId },
  })
}

/**
 * 删除行程
 * @param tripId - 行程ID
 */
export const deleteTrip = (tripId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/trip/del',
    data: { tripId },
  })
}

/**
 * 获取所有行程列表
 * @param pageNum - 页码
 * @param pageSize - 每页条数
 */
export const tripListFindAll = (pageNum: number, pageSize: number) => {
  return request<TripListPageResult>({
    method: 'GET',
    url: '/trip/findAllList',
    params: { pageNum, pageSize },
  })
}
