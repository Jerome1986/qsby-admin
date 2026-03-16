import { request } from '@/utils/request.ts'
import type { UpdateResult } from '@/types/Gobal'
import type { CityItem } from '@/types/City'

/**
 * 获取所有城市
 */
export const cityGetAll = () => {
  return request<CityItem[]>({
    method: 'GET',
    url: '/city/findAll',
  })
}

/**
 * 更新城市接口
 * @param cityId - 城市ID
 * @param name - 城市名称
 * @param status - 城市激活状态
 */
export const cityUpdate = (cityId: string, name: string, status: 'active' | 'disabled') => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/city/updateOne',
    data: { cityId, name, status },
  })
}
