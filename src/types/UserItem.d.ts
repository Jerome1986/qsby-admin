export type UserStatus = 'active' | 'disabled'
export type Gender = 0 | 1 | 2
export type UserRole = 'user' | 'manager' | 'admin'

export interface UserItem {
  /** mongoId */
  _id: string
  /** 微信 openid */
  openid: string
  /** 手机号 */
  mobile: string
  /** 昵称 */
  nickname: string
  /** 真实姓名 */
  username: string
  /** 头像 */
  avatarUrl: string
  /** 性别 0未知 1男 2女 */
  gender: Gender
  /** 年龄 */
  age: string
  /** 角色 */
  role: UserRole
  /** 状态 */
  status: UserStatus
  /** 身份证号码 */
  idCard?: string
  /** 身份证正面 */
  idCardFront?: string
  /** 身份证背面 */
  idCardBack?: string
  /** 注册时间 */
  registerTime: Date
  /** 更新时间 */
  updatedAt?: Date
  /** 管理员生效时间 */
  managerStartTime?: Date | null
  /** 管理员结束时间 */
  managerEndTime?: Date | null
  /** 推荐码（自己的） */
  referralCode: string
  /** 邀请人推荐码 */
  inviterCode?: string
  /** 邀请二维码 */
  myCodeUrl?: string
  /** 积分 */
  score: number
  /** 代金券余额 */
  balance: number
  /** 头像更新时间 */
  avatarUpdateAt?: Date
  /** 头像修改次数 */
  avatarUpdateCount?: number
}

// 带页码类型
export type PagesUserResult = {
  /** 用户列表 */
  list: UserItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}
