import { request } from '@/utils/request'
import type { Gender, PagesUserResult, UserItem, UserRole, UserStatus } from '@/types/UserItem'
import type { UpdateResult } from '@/types/Gobal'
import type { PagesApplyResult } from '@/types/ManagerApplyFor.ts'

/**
 * 根据角色获取所有用户
 * @param role - 用户角色
 * @param pageNum - 页码
 * @param pageSize - 条数
 */
export const getUserByRole = (role: UserRole, pageNum: number, pageSize: number) => {
  return request<PagesUserResult>({
    method: 'GET',
    url: '/user/findAll',
    params: {
      role,
      pageNum,
      pageSize,
    },
  })
}

/**
 * 根据用户ID更新用户信息
 * @param userId - 用户ID
 * @param nickname - 昵称
 * @param username - 真实姓名
 * @param age - 年龄
 * @param gender - 性别
 * @param mobile - 手机号
 * @param role - 角色
 * @param idCard - 身份证号
 * @param status - 账号状态 active 激活  disabled 禁用
 */
export const updateUserById = (
  userId: string,
  nickname: string,
  username: string,
  age: string,
  gender: Gender,
  mobile: string,
  role: UserRole,
  idCard: string,
  status: UserStatus,
) => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/user/update',
    data: {
      userId,
      nickname,
      username,
      age,
      gender,
      mobile,
      role,
      idCard,
      status,
    },
  })
}
/**
 * 根据手机号和用户角色搜索用户
 * @param mobile - 用户手机号
 * @param role - 角色
 */
export const searchUserByMobile = (mobile: string, role: UserRole) => {
  return request<UserItem[]>({
    method: 'POST',
    url: '/user/searchMobile',
    data: { mobile, role },
  })
}

/**
 * 获取所有的主理人申请
 */
export const managerApplyFindAll = (status: string, pageNum: number, pageSize: number) => {
  return request<PagesApplyResult>({
    method: 'GET',
    url: '/managerAPPly/FindAllByStatus',
    params: { status, pageNum, pageSize },
  })
}

/**
 * 处理主理人申请结果
 * @param userId - 用户ID
 * @param status - 订单状态
 * @param type - 操作类型
 * @param remark - 拒绝原因（拒绝时必填）
 */
export const updateManagerApply = (
  userId: string,
  status: string,
  type: string,
  remark?: string,
) => {
  return request({
    method: 'POST',
    url: '/managerAPPly/updateOne',
    data: { userId, status, type, remark },
  })
}
