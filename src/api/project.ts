import { request } from '@/utils/request.ts'
import type {
  ProjectTypeListPageResult,
  ProjectTypeStatus,
  ProjectModeListPageResult,
  ProjectScaleListPageResult,
} from '@/types/Project'
import type { AddResult, DelResult } from '@/types/Gobal'
import type { ProjectListPageResult } from '@/types/Project'

/**
 * 新增项目分类
 */
export const projectAddType = (
  name: string,
  sort: number = 0,
  status: ProjectTypeStatus = 'active',
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/project/addType',
    data: { name, sort, status },
  })
}

/**
 * 获取所有项目类型
 */
export const getProjectTypes = (pageNum: number, pageSize: number) => {
  return request<ProjectTypeListPageResult>({
    method: 'GET',
    url: '/project/findAllProjectTypes',
    params: { pageNum, pageSize },
  })
}

/**
 * 更新项目分类
 */
export const projectUpdateType = (
  projectTypeId: string,
  name: string,
  sort: number,
  status: ProjectTypeStatus,
) => {
  return request({
    method: 'POST',
    url: '/project/updateType',
    data: { projectTypeId, name, sort, status },
  })
}

/**
 * 删除指定项目分类
 */
export const deleteProjectType = (projectTypeId: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/project/delType',
    data: { projectTypeId },
  })
}

/** 项目列表搜索参数 */
export interface ProjectListSearchParams {
  /** 项目名称（模糊搜索） */
  name?: string
  /** 项目类型ID（industry 字段），传 'all' 或不传表示不限 */
  industry?: string
  /** 合作方式ID，传 'all' 或不传表示不限 */
  cooperationMode?: string
  /** 合作规模ID，传 'all' 或不传表示不限 */
  cooperationScale?: string
}

/**
 * 获取所有项目列表（含搜索）
 */
export const projectListFindAll = (
  pageNum: number,
  pageSize: number,
  searchParams?: ProjectListSearchParams,
) => {
  const params: Record<string, string | number> = { pageNum, pageSize }
  if (searchParams?.name?.trim()) params.name = searchParams.name.trim()
  if (searchParams?.industry && searchParams.industry !== 'all') params.industry = searchParams.industry
  if (searchParams?.cooperationMode && searchParams.cooperationMode !== 'all')
    params.cooperationMode = searchParams.cooperationMode
  if (searchParams?.cooperationScale && searchParams.cooperationScale !== 'all')
    params.cooperationScale = searchParams.cooperationScale
  return request<ProjectListPageResult>({
    method: 'GET',
    url: '/project/findAllList',
    params,
  })
}

// ======================== 合作方式 ========================

export const projectAddMode = (name: string, sort: number = 0, status: ProjectTypeStatus = 'active') => {
  return request<AddResult>({
    method: 'POST',
    url: '/project/addMode',
    data: { name, sort, status },
  })
}

export const getProjectModes = (pageNum: number, pageSize: number) => {
  return request<ProjectModeListPageResult>({
    method: 'GET',
    url: '/project/findAllModes',
    params: { pageNum, pageSize },
  })
}

export const projectUpdateMode = (
  id: string,
  name: string,
  sort: number,
  status: ProjectTypeStatus,
) => {
  return request({
    method: 'POST',
    url: '/project/updateMode',
    data: { projectModeId: id, name, sort, status },
  })
}

export const deleteProjectMode = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/project/delMode',
    data: { projectModeId: id },
  })
}

// ======================== 合作规模 ========================

export const projectAddScale = (name: string, sort: number = 0, status: ProjectTypeStatus = 'active') => {
  return request<AddResult>({
    method: 'POST',
    url: '/project/addScale',
    data: { name, sort, status },
  })
}

export const getProjectScales = (pageNum: number, pageSize: number) => {
  return request<ProjectScaleListPageResult>({
    method: 'GET',
    url: '/project/findAllScales',
    params: { pageNum, pageSize },
  })
}

export const projectUpdateScale = (
  id: string,
  name: string,
  sort: number,
  status: ProjectTypeStatus,
) => {
  return request({
    method: 'POST',
    url: '/project/updateScale',
    data: { projectScaleId: id, name, sort, status },
  })
}

export const deleteProjectScale = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/project/delScale',
    data: { projectScaleId: id },
  })
}
