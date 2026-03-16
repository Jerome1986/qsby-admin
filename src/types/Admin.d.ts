// 管理员数据类型
export interface AdminItem {
  /** mongoId */
  _id: string
  /** 角色 */
  role: AdminRole
  /** 账号 */
  account: string
  /** 密码 */
  password: string
  /** 登录次数 */
  loginCount: number
  /** 注册IP */
  registerIp: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 状态 */
  status: AdminStatus
}

/** 管理员角色 */
export type AdminRole = 'admin' | 'superAdmin'
/** 管理员状态 */
export type AdminStatus = 'active' | 'disabled'
