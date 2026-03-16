import { request } from '@/utils/request.ts'
import type { AddResult, DelResult, UpdateResult } from '@/types/Gobal'
import type { AdminItem, AdminRole, AdminStatus } from '@/types/Admin'

/**
 * 新增管理员
 * @param role - 管理员角色 admin 审核员  superAdmin 超级管理员
 * @param account - 账号
 * @param password - 密码
 * @param status - 激活状态  'active' | 'disabled'
 */
export const addAdminUserApi = (
  role: AdminRole,
  account: string,
  password: string,
  status: AdminStatus,
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/settings/setAdmin',
    data: { role, account, password, status },
  })
}

/**
 * 获取所有管理员用户
 */
export const getAdminUser = () => {
  return request<AdminItem[]>({
    method: 'GET',
    url: '/settings/getAdmin',
  })
}

/**
 * 更新管理员用户
 * @param adminId - 管理员ID
 * @param role - 管理员角色 admin 审核员  superAdmin 超级管理员
 * @param account - 账号
 * @param password - 密码
 * @param status - 激活状态  'active' | 'disabled'
 */
export const updateAdminUserApi = (
  adminId: string,
  role: AdminRole,
  account: string,
  password: string,
  status: AdminStatus,
) => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/settings/updateAdmin',
    data: { adminId, role, account, password, status },
  })
}

/**
 * 删除指定管理员账号
 * @param adminId - 管理员ID
 */
export const deleteAdminUserApi = (adminId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/settings/delAdmin',
    data: { adminId },
  })
}
