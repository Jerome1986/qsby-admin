/** 提现申请状态 */
export type WithdrawApplyStatus = 'pending' | 'approved' | 'rejected'

/** 提现申请表 */
export interface WithdrawApplyItem {
  /** 文档ID */
  _id: string
  /** 用户ID */
  userId: string
  /** 姓名 */
  name: string
  /** 银行卡号 */
  bankCard: string
  /** 开户行 */
  openBank: string
  /** 手机号 */
  mobile: string
  /** 提现金额（单位：元） */
  amount: number
  /** 账户余额 */
  balance: number
  /** 申请状态 */
  status: WithdrawApplyStatus
  /** 备注 */
  remark: string
  /** 创建时间 */
  createdAt: string | Date
  /** 更新时间 */
  updatedAt: string | Date
}

/** 提现申请分页结果 */
export interface WithdrawApplyPageResult {
  list: WithdrawApplyItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
