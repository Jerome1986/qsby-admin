/**
 * 高德地图公共配置与工具
 */
import AMapLoader from '@amap/amap-jsapi-loader'

export const AMAP_DEFAULT_CENTER: [number, number] = [116.397428, 39.90923]

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY
const AMAP_SECURITY = import.meta.env.VITE_AMAP_SECURITY_KEY

export const hasAmapConfig = () => !!(AMAP_KEY && AMAP_SECURITY)

export const setAmapSecurity = () => {
  ;(window as unknown as { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY,
  }
}

/** 加载高德地图基础库 */
export const loadAMap = (plugins: string[] = []) =>
  AMapLoader.load({ key: AMAP_KEY, version: '2.0', plugins })
