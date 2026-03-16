import { request } from '@/utils/request.ts'
import type { ActivityTypeListPageResult, ActivityTypeStatus } from '@/types/Activity'
import type { AddResult, DelResult } from '@/types/Gobal'
import type { ActivityListPageResult } from '@/types/Activity'

/**
 * 新增活动分类
 * @param name - 分类名称
 * @param sort - 排序，默认 0
 * @param status - 显示状态，默认 'active'
 */
export const activityAddType = (
  name: string,
  sort: number = 0,
  status: ActivityTypeStatus = 'active',
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/activity/addType',
    data: { name, sort, status },
  })
}
/**
 * 获取所有活动的类型
 */
export const getActivityTypes = (pageNum: number, pageSize: number) => {
  return request<ActivityTypeListPageResult>({
    method: 'GET',
    url: '/activity/findAllActivityTypes',
    params: { pageNum, pageSize },
  })
}

/**
 * 更新活动分类
 * @param activityTypeId - 活动类型ID
 * @param name - 分类名称
 * @param sort - 排序
 * @param status - 显示状态 'active' | 'disabled'
 */
export const activityUpdateType = (
  activityTypeId: string,
  name: string,
  sort: number,
  status: ActivityTypeStatus,
) => {
  return request({
    method: 'POST',
    url: '/activity/updateType',
    data: { activityTypeId, name, sort, status },
  })
}

/**
 * 删除指定活动分类
 */
export const deleteActivityType = (activityTypeId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/activity/delType',
    data: { activityTypeId },
  })
}

/**
 * 获取所有活动列表
 */
export const activityListFindAll = (pageNum: number, pageSize: number) => {
  return request<ActivityListPageResult>({
    method: 'GET',
    url: '/activity/findAllList',
    params: { pageNum, pageSize },
  })
}
