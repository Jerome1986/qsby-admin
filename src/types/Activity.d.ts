export type ActivityTypeStatus = 'active' | 'disabled'

/** 活动类型 */
export interface ActivityTypeItem {
  /** mongoID */
  _id: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort: number
  /** 是否显示 */
  status: ActivityTypeStatus
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updateAt: Date
}

export interface ActivityTypeListPageResult {
  list: ActivityTypeItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 活动列表项 */
export interface ActivityFormData {
  _id: string
  cover: string
  title: string
  type: string
  typeName: string
  time: string
  address_name: string
  event_address: string
  wechat: string
  phone: string
  maxPeople: number
  maleCount: number
  femaleCount: number
  userFee: number
  commission: number
  requirement: string
  images: string[]
  status: 'pending' | 'active' | 'finished' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface ActivityListPageResult {
  list: ActivityFormData[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
