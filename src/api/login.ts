import { request } from '@/utils/request.ts'
import type { AdminLoginResponse } from '@/types/Login'

/**
 * 登录
 * @param account - 账号
 * @param password - 密码
 */
export const loginAdmin = (account: string, password: string) => {
  return request<AdminLoginResponse>({
    method: 'POST',
    url: '/login',
    data: { account, password },
  })
}
