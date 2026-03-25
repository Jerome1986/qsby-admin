import { request } from '@/utils/request.ts'
import type { AddResult, DelResult, UpdateResult } from '@/types/Gobal'
import type { GroupChatItem } from '@/types/GroupChat'

/**
 * 获取群聊二维码列表（最多一条）
 */
export const groupChatFindAll = () => {
  return request<GroupChatItem[]>({
    method: 'GET',
    url: '/groupChat/findAll',
  })
}

/**
 * 新增群聊二维码（仅当不存在记录时可成功）
 */
export const groupChatAddOne = (data: { qrImage: string; remark?: string }) => {
  return request<AddResult>({
    method: 'POST',
    url: '/groupChat/addOne',
    data,
  })
}

/**
 * 更新群聊二维码
 */
export const groupChatUpdateOne = (
  groupChatId: string,
  data: { qrImage: string; remark?: string },
) => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/groupChat/updateOne',
    data: { groupChatId, ...data },
  })
}

/**
 * 删除群聊二维码
 */
export const groupChatDeleteOne = (groupChatId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/groupChat/deleteOne',
    data: { groupChatId },
  })
}
