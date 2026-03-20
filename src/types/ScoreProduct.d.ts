export type ScoreProductCategoryStatus = 'active' | 'disabled'

export interface ScoreProductCategory {
  /** mongoID */
  _id: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort: number
  /** 是否显示 */
  status: ScoreProductCategoryStatus
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updateAt: Date
}

export interface ScoreProductCategoryPage {
  /** 分类列表 */
  list: ScoreProductCategory[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}

// 积分商品
export interface ScoreProduct {
  /** mongoId */
  _id: string
  /** 商品名称 */
  name: string
  /** 封面图 */
  cover: string
  /** 详情图 */
  images: string[]
  /** 分类ID */
  category: string
  /** 分类名称 */
  categoryName: string
  /** 积分价格 */
  scorePrice: number
  /** 关联门店ID */
  storeId?: string
  /** 门店名称 */
  storeName?: string
  /** 商品状态 */
  status: 'active' | 'disabled'
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
}

export interface ScoreProductPage {
  /** 商品列表 */
  list: ScoreProduct[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}
