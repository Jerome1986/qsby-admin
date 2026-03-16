export type CityStatus = 'active' | 'disabled'

/** 城市/站点 */
export interface CityItem {
  /** mongoID */
  _id: string
  /** 站点名称 */
  name: string
  /** 城市编码（如行政区划代码） */
  code: string
  /** 状态：启用/禁用 */
  status: CityStatus
  /** 排序，可选 */
  sort?: number
  /** 创建时间 */
  createdAt?: Date | string
  /** 更新时间 */
  updatedAt?: Date | string
}
