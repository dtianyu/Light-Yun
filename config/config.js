// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/workplace',
            },
            {
              name: 'workplace',
              icon: 'smile',
              path: '/workplace',
              component: './workplace',
            },
            {
              path: '/admin',
              name: 'admin',
              icon: 'crown',
              component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/sub-page',
                  name: 'sub-page',
                  icon: 'smile',
                  component: './Welcome',
                  authority: ['admin'],
                },
              ],
            },
            {
              name: 'custom',
              icon: 'home',
              path: '/custom',
              routes: [
                {
                  name: 'company',
                  icon: 'smile',
                  path: '/custom/company',
                  component: './custom/company',
                },
                {
                  name: 'demands',
                  icon: 'smile',
                  path: '/custom/demands',
                  component: './custom/demands',
                },
                {
                  name: 'tasks',
                  icon: 'smile',
                  path: '/custom/tasks',
                  component: './custom/tasks',
                },
                {
                  name: 'taskEdit',
                  icon: 'smile',
                  path: '/custom/tasks/taskEdit',
                  component: './custom/tasks/components/TaskEdit',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: 'profileadvanced',
              icon: 'smile',
              path: '/profileadvanced',
              component: './ProfileAdvanced',
            },
            {
              name: 'formadvancedform',
              icon: 'smile',
              path: '/formadvancedform',
              component: './FormAdvancedForm',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              name: 'production-marketing',
              path: '/production-marketing',
              icon: 'home',
              routes: [
                {
                  name: 'product-series',
                  icon: 'smile',
                  path: '/production-marketing/product-series',
                  component: './ProductionMarketing/ProductSeries',
                },
                {
                  name: 'product',
                  icon: 'smile',
                  path: '/production-marketing/product',
                  component: './ProductionMarketing/Product',
                },
                {
                  name: 'product-bom',
                  icon: 'smile',
                  path: '/production-marketing/product-bom',
                  component: './ProductionMarketing/Product/components/BOM',
                  hideInMenu: true,
                },
                {
                  name: 'sales-order',
                  icon: 'smile',
                  path: '/production-marketing/sales-order',
                  component: './ProductionMarketing/SalesOrder',
                },
                {
                  name: 'order-detail',
                  icon: 'smile',
                  path: '/production-marketing/order-detail',
                  component: './ProductionMarketing/SalesOrder/components/OrderDetail',
                  hideInMenu: true,
                },
                {
                  name: 'production-plan',
                  icon: 'smile',
                  path: '/production-marketing/production-plan',
                  component: './ProductionMarketing/ProductionPlan',
                },
                {
                  name: 'plan-detail',
                  icon: 'smile',
                  path: '/production-marketing/plan-detail',
                  component: './ProductionMarketing/ProductionPlan/components/PlanDetail',
                  hideInMenu: true,
                },
                {
                  name: 'production-demand',
                  icon: 'smile',
                  path: '/production-marketing/production-demand',
                  component: './ProductionMarketing/ProductionDemand',
                },
                {
                  name: 'demand-detail',
                  icon: 'smile',
                  path: '/production-marketing/demand-detail',
                  component: './ProductionMarketing/ProductionDemand/components/DemandDetail',
                  hideInMenu: true,
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
