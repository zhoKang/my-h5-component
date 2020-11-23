import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/index', component: '@/pages/index' },
        { path: '/captcha', component: '@/pages/captcha' },
      ],
    },
  ],
});
