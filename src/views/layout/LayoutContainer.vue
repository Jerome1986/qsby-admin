<script setup lang="ts">
import { HomeFilled, User, Flag, Location, Setting, List, Folder, Shop, Coin, Document } from '@element-plus/icons-vue'
</script>

<template>
  <el-container class="layout-container">
    <el-aside class="layout-aside" width="180">
      <div class="logo">Logo</div>
      <el-menu :default-active="$route.path" background-color="#444444" text-color="#fff" active-text-color="#333"
        :router="true">
        <el-menu-item index="/home">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>控制面板</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/user/normal">普通用户</el-menu-item>
            <el-menu-item index="/user/agent">主理人</el-menu-item>
            <el-menu-item index="/user/agent-apply">主理人申请</el-menu-item>
            <el-menu-item index="/user/withdraw-apply">提现申请</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/order">
          <template #title>
            <el-icon>
              <List />
            </el-icon>
            <span>订单管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/order/trip">行程订单</el-menu-item>
            <el-menu-item index="/order/activity">活动订单</el-menu-item>
            <el-menu-item index="/order/project">项目订单</el-menu-item>
            <el-menu-item index="/order/shop">门店订单</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/activity">
          <template #title>
            <el-icon>
              <Flag />
            </el-icon>
            <span>活动管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/activity/type">类型设置</el-menu-item>
            <el-menu-item index="/activity/list">活动列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/trip">
          <template #title>
            <el-icon>
              <Location />
            </el-icon>
            <span>行程管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/trip/type">类型设置</el-menu-item>
            <el-menu-item index="/trip/list">行程列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/store">
          <template #title>
            <el-icon>
              <Shop />
            </el-icon>
            <span>门店管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/store/category">门店分类</el-menu-item>
            <el-menu-item index="/store/list">门店列表</el-menu-item>
            <el-menu-item index="/store/product-type">产品类型</el-menu-item>
            <el-menu-item index="/store/product">产品管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/score">
          <template #title>
            <el-icon>
              <Coin />
            </el-icon>
            <span>积分管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/score/category">分类列表</el-menu-item>
            <el-menu-item index="/score/list">商品列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/content">
          <template #title>
            <el-icon>
              <Document />
            </el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/content/brand">品牌介绍</el-menu-item>
            <el-menu-item index="/content/store-intro">门店介绍</el-menu-item>
            <el-menu-item index="/content/surrounding">周边推荐</el-menu-item>
            <el-menu-item index="/content/rights">权益说明</el-menu-item>
            <el-menu-item index="/content/tips">温馨提示</el-menu-item>
            <el-menu-item index="/content/booking-note">预约须知</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="/project">
          <template #title>
            <el-icon>
              <Folder />
            </el-icon>
            <span>项目管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/project/type">类型设置</el-menu-item>
            <el-menu-item index="/project/mode">合作方式</el-menu-item>
            <el-menu-item index="/project/scale">合作规模</el-menu-item>
            <el-menu-item index="/project/list">项目列表</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <!--   系统管理   -->
        <el-sub-menu index="/system">
          <template #title>
            <el-icon>
              <Setting />
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/system/city">城市管理</el-menu-item>
            <el-menu-item index="/system/admin">设置管理</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="layout-header">Header</el-header>
      <el-main class="layout-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #444444;
  overflow-x: hidden;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }

  .el-menu {
    border-right: none;

    :deep(.el-menu-item:hover) {
      background-color: #666 !important;
    }

    :deep(.el-menu-item.is-active) {
      background-color: #fff;
      color: #333;
    }

    :deep(.el-sub-menu__title:hover) {
      background-color: #666 !important;
    }

    :deep(.el-menu-item-group__title) {
      padding: 0;
    }
  }
}

.layout-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
}

.layout-main {
  background-color: #f5f5f5;
  overflow: hidden;
}
</style>
