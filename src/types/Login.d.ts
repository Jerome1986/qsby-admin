/** 管理员登录成功返回数据 */
export interface AdminLoginResponse {
  /** 登录凭证 */
  token: string
  /** 管理员信息 */
  adminInfo: {
    /** 管理员ID */
    adminId: string
    /** 角色 */
    role: string
    /** 账号 */
    account: string
  }
}
