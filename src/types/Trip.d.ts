export type TripTypeStatus = 'active' | 'disabled'

// 行程列表类型
export interface TripTypeItem {
  /** mongoID */
  _id: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort: number
  /** 是否显示 */
  status: TripTypeStatus
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updateAt: Date
}

export interface TripTypeListPageResult {
  /** 用户列表 */
  list: TripTypeItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}

// 发布行程表单数据类型
export interface PublicFormData {
  /** 发布者昵称 */
  publisherName
  /** 发布者头像 */
  publisherAvatar
  /** 封面图 */
  cover: string
  /** 行程主题 */
  title: string
  /** 行程类型Id */
  type: string
  /** 行程类型名称 */
  typeName: string
  /** 行程时间 */
  time: Date
  /** 行程地点-地图上的商户名 */
  address_name: string
  /** 行程地址-地图上的具体位置 */
  event_address: string
  /** 纬度 */
  latitude: string
  /** 经度 */
  longitude: string
  /** 联系微信 */
  wechat: string
  /** 联系电话 */
  phone: string
  /** 人数限制 */
  maxPeople: number
  /** 男士报名 */
  maleCount: number
  /** 女士报名 */
  femaleCount: number
  /** 已报名人数 */
  enrollCount: number
  /** 用户报名费用 */
  userFee: number
  /** 主理人佣金 */
  commission: number
  /** 行程需求 */
  requirement: string
  /** 内容图片 */
  images: string[]
  /** 行程状态 */
  status: 'pending' | 'active' | 'finished' | 'cancelled'
  /** 是否上线 */
  isOnline: 'active' | 'disabled'
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

export interface TripListPageResult {
  /** 行程列表 */
  list: PublicFormData[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}
