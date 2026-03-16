export type StoreStatus = 'active' | 'disabled'

/** 门店分类 */
export interface StoreCategoryItem {
  _id: string
  name: string
  sort: number
  status: StoreStatus
  createdAt: Date
  updateAt: Date
}

export interface StoreCategoryListPageResult {
  list: StoreCategoryItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 产品类型 */
export interface ProductTypeItem {
  _id: string
  name: string
  sort: number
  status: StoreStatus
  createdAt: Date
  updateAt: Date
}

export interface ProductTypeListPageResult {
  list: ProductTypeItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 门店 */
export interface StoreItem {
  _id: string
  /** 站点（城市）ID */
  cityId: string
  /** 站点名称 */
  cityName?: string
  /** 门店分类ID */
  categoryId: string
  /** 门店分类名称 */
  categoryName?: string
  /** 门店封面图 */
  cover: string
  /** 门店名字 */
  name: string
  /** 门店地址 */
  address: string
  /** 门店电话 */
  phone?: string
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
  /** 门店介绍 */
  description: string
  status?: StoreStatus
  createdAt?: string
  updatedAt?: string
}

export interface StoreListPageResult {
  list: StoreItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 产品（住宿：大床房、双床房等，可扩展） */
export interface ProductItem {
  _id: string
  /** 关联门店ID */
  storeId: string
  /** 门店名称 */
  storeName?: string
  /** 产品类型ID */
  prodcutTypeId: string
  /** 产品类型名称 */
  prodcutTypeName: string
  /** 产品名称，如：大床房、双床房 */
  name: string
  /** 价格 */
  price: number
  /** 主理人佣金/折扣 固定值 */
  commission: number
  /** 封面图 */
  cover?: string
  /** 详情图片 */
  images?: string[]
  /** 简介 */
  description?: string
  /** 排序 */
  sort?: number
  status?: StoreStatus
  createdAt?: string
  updatedAt?: string
}

export interface ProductListPageResult {
  list: ProductItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
