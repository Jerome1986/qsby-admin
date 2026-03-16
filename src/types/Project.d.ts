export type ProjectTypeStatus = 'active' | 'disabled'

/** 项目分类 */
export interface ProjectTypeItem {
  /** mongoID */
  _id: string
  /** 分类名称 */
  name: string
  /** 排序 */
  sort: number
  /** 是否显示 */
  status: ProjectTypeStatus
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updateAt: Date
}

export interface ProjectTypeListPageResult {
  list: ProjectTypeItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 合作方式选项（可配置，同项目分类） */
export interface ProjectModeItem {
  _id: string
  name: string
  sort: number
  status: ProjectTypeStatus
  createdAt: Date
  updateAt: Date
}

export interface ProjectModeListPageResult {
  list: ProjectModeItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 合作规模选项（可配置，同项目分类） */
export interface ProjectScaleItem {
  _id: string
  name: string
  sort: number
  status: ProjectTypeStatus
  createdAt: Date
  updateAt: Date
}

export interface ProjectScaleListPageResult {
  list: ProjectScaleItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/** 项目列表项 - 与后端 findAllList 返回字段一致 */
export interface ProjectFormData {
  _id: string
  /** 封面图 */
  cover?: string
  /** 项目名称 */
  title?: string
  /** 地址名称（门店名） */
  address_name?: string
  /** 详细地址 */
  event_address?: string
  /** 项目类型名称 */
  typeName?: string
  /** 行业ID */
  industry?: string
  /** 行业名称（关联查询） */
  industryName?: string
  /** 简介 */
  introduction?: string
  /** 合作方式ID */
  cooperationMode?: string
  /** 合作方式名称（关联查询） */
  cooperationModeName?: string
  /** 合作规模ID */
  cooperationScale?: string
  /** 合作规模名称（关联查询） */
  cooperationScaleName?: string
  /** 创建时间 */
  createAt?: string
  /** 更新时间 */
  updateAt?: string
  /** 联系电话 */
  phone?: string
  /** 微信 */
  wechat?: string
  /** 查看费用 */
  viewFee?: number
  /** 兼容旧字段 */
  name?: string
  city?: string
  industryCategory?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProjectListPageResult {
  list: ProjectFormData[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
