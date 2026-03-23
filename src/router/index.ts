import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/Login.vue'),
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      children: [
        { path: '/home', component: () => import('@/views/home/Home.vue') },
        { path: '/user/normal', component: () => import('@/views/user/NormalUser.vue') },
        { path: '/user/agent', component: () => import('@/views/user/Agent.vue') },
        { path: '/user/agent-apply', component: () => import('@/views/user/AgentApply.vue') },
        { path: '/user/withdraw-apply', component: () => import('@/views/withdraw/WithdrawApply.vue') },
        // 订单管理
        {
          path: '/order',
          component: () => import('@/views/order/Order.vue'),
          redirect: '/order/trip',
          children: [
            { path: 'trip', component: () => import('@/views/order/OrderTripList.vue') },
            { path: 'activity', component: () => import('@/views/order/OrderActivityList.vue') },
            { path: 'project', component: () => import('@/views/order/OrderProjectList.vue') },
            { path: 'shop', component: () => import('@/views/order/OrderShopList.vue') },
          ],
        },
        // 活动管理
        {
          path: '/activity',
          component: () => import('@/views/activity/Activity.vue'),
          redirect: '/activity/type',
          children: [
            { path: 'type', component: () => import('@/views/activity/ActivityType.vue') },
            { path: 'list', component: () => import('@/views/activity/ActivityList.vue') },
          ],
        },
        // 行程管理
        {
          path: '/trip',
          component: () => import('@/views/trip/Trip.vue'),
          redirect: '/trip/type',
          children: [
            { path: 'type', component: () => import('@/views/trip/TripType.vue') },
            { path: 'list', component: () => import('@/views/trip/TripList.vue') },
          ],
        },
        // 门店管理
        {
          path: '/store',
          component: () => import('@/views/store/Store.vue'),
          redirect: '/store/category',
          children: [
            { path: 'category', component: () => import('@/views/store/StoreCategory.vue') },
            { path: 'product-type', component: () => import('@/views/store/StoreProductType.vue') },
            { path: 'list', component: () => import('@/views/store/StoreList.vue') },
            { path: 'content-setting', component: () => import('@/views/store/StoreContentSetting.vue') },
            { path: 'booking-note', component: () => import('@/views/store/StoreBookingNote.vue') },
            { path: 'product', component: () => import('@/views/store/ProductManage.vue') },
          ],
        },
        // 积分管理
        {
          path: '/score',
          component: () => import('@/views/score/Score.vue'),
          redirect: '/score/category',
          children: [
            { path: 'category', component: () => import('@/views/score/ScoreCategory.vue') },
            { path: 'list', component: () => import('@/views/score/ScoreProductList.vue') },
          ],
        },
        // 项目管理
        {
          path: '/project',
          component: () => import('@/views/project/Project.vue'),
          redirect: '/project/type',
          children: [
            { path: 'type', component: () => import('@/views/project/ProjectType.vue') },
            { path: 'mode', component: () => import('@/views/project/ProjectMode.vue') },
            { path: 'scale', component: () => import('@/views/project/ProjectScale.vue') },
            { path: 'list', component: () => import('@/views/project/ProjectList.vue') },
          ],
        },
        // 内容管理
        {
          path: '/content',
          component: () => import('@/views/content/Content.vue'),
          redirect: '/content/brand',
          children: [
            { path: 'brand', component: () => import('@/views/content/BrandManage.vue') },
            { path: 'rights', component: () => import('@/views/content/RightsManage.vue') },
            { path: 'tips', component: () => import('@/views/content/TipsManage.vue') },
          ],
        },
        // 系统管理
        {
          path: '/system',
          component: () => import('@/views/system/SystemManager.vue'),
          redirect: '/system/city',
          children: [
            { path: 'city', component: () => import('@/views/system/CityManager.vue') },
            { path: 'admin', component: () => import('@/views/system/SetAdmin.vue') },
          ],
        },
      ],
    },
  ],
})

// 全局路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  const remainingMs = userStore.expiresAt - Date.now() // 毫秒数

  if ((!userStore.token || remainingMs <= 0) && to.path !== '/login') {
    return '/login'
  }
})

export default router
