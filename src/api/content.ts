import { request } from '@/utils/request.ts'
import type {
  BrandContent,
  BookingNoteContent,
  ContentPageData,
  ContentPageCode,
  RightsBenefitsItem,
  RightsType,
  TipsItem,
  TipsType,
} from '@/types/Content'
import type { AddResult } from '@/types/Gobal'

// ======================== 权益说明（独立表） ========================

/** 获取权益说明列表（3 条：民宿博主/活动策划人/旅游博主） */
export const getRightsList = () => {
  return request<RightsBenefitsItem[]>({
    method: 'GET',
    url: '/content/rightsList',
  })
}

/** 更新权益说明单项 */
export const updateRightsItem = (
  type: RightsType,
  data: { title: string; content: string; image: string },
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/content/updateRights',
    data: { type, ...data },
  })
}

// ======================== 温馨提示（独立表） ========================

/** 获取温馨提示列表（3 条：行程/活动/项目） */
export const getTipsList = () => {
  return request<TipsItem[]>({
    method: 'GET',
    url: '/content/tipsList',
  })
}

/** 更新温馨提示单项 */
export const updateTipsItem = (type: TipsType, data: { title: string; items: string[] }) => {
  return request<AddResult>({
    method: 'POST',
    url: '/content/updateTips',
    data: { type, ...data },
  })
}

// ======================== 预约须知（独立表） ========================

/** 获取预约须知 */
export const getBookingNote = () => {
  return request<BookingNoteContent>({
    method: 'GET',
    url: '/content/bookingNote',
  })
}

/** 更新预约须知 */
export const updateBookingNote = (data: { items: { title: string; content: string }[] }) => {
  return request<AddResult>({
    method: 'POST',
    url: '/content/updateBookingNote',
    data,
  })
}

// ======================== 品牌介绍 ========================

/** 获取品牌内容（按 code 查询，单条） */
export const getBrandContent = () => {
  return request<BrandContent>({
    method: 'GET',
    url: '/content/brand',
  })
}

/** 更新品牌内容 */
export const updateBrandContent = (data: Omit<BrandContent, '_id' | 'createdAt' | 'updatedAt'>) => {
  return request<AddResult>({
    method: 'POST',
    url: '/content/updateBrand',
    data,
  })
}

// ======================== 门店介绍（结构与品牌介绍相同） ========================

/** 获取门店介绍 */
export const getStoreIntro = () => {
  return request<ContentPageData>({
    method: 'GET',
    url: '/content/storeIntro',
  })
}

/** 更新门店介绍 */
export const updateStoreIntro = (
  data: Omit<ContentPageData, '_id' | 'createdAt' | 'updatedAt'>,
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/content/updateStoreIntro',
    data,
  })
}

// ======================== 周边推荐（结构与品牌介绍相同） ========================

/** 获取周边推荐 */
export const getSurrounding = () => {
  return request<ContentPageData>({
    method: 'GET',
    url: '/content/surrounding',
  })
}

/** 更新周边推荐 */
export const updateSurrounding = (
  data: Omit<ContentPageData, '_id' | 'createdAt' | 'updatedAt'>,
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/content/updateSurrounding',
    data,
  })
}
