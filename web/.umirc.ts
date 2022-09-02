// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

const name = 'issues-helper';

const logo =
  'https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*8xDgSL-O6O4AAAAAAAAAAAAAARQnAQ';

export default defineConfig({
  title: 'Issues Helper',
  mode: 'site',
  favicon: logo,
  logo,
  exportStatic: {},
  ssr: {},
  outputPath: '../docs-dist',
  resolve: {
    includes: ['./docs'],
  },
  hash: true,
  base: `/${name}/`,
  publicPath: `/${name}/`,
  locales: [
    ['en-US', 'English'],
    ['zh-CN', '中文'],
  ],
  theme: {
    '@c-primary': '#1890ff',
  },
  navs: {
    'en-US': [
      { title: 'Guide', path: '/guide' },
      { title: 'Base', path: '/base' },
      { title: 'Advanced', path: '/advanced' },
      { title: 'Changelog', path: '/changelog' },
      { title: 'GitHub', path: 'https://github.com/actions-cool/issues-helper' },
    ],
    'zh-CN': [
      { title: '指 南', path: '/zh-CN/guide' },
      { title: '基 础', path: '/zh-CN/base' },
      { title: '进 阶', path: '/zh-CN/advanced' },
      { title: '更新日志', path: '/zh-CN/changelog' },
      { title: 'GitHub', path: 'https://github.com/actions-cool/issues-helper' },
    ],
  },
  menus: {
    '/guide': [
      {
        title: '🍭 Guide',
        children: ['/guide/index', '/guide/start'],
      },
      {
        title: '🎁 Reference',
        path: '/guide/ref',
      },
      {
        title: '🎗 Note',
        path: '/guide/note',
      },
      {
        title: '💬 FAQ',
        path: '/guide/faq',
      },
    ],
    '/zh-CN/guide': [
      {
        title: '🍭 介 绍',
        children: ['/guide/index', '/guide/start'],
      },
      {
        title: '🎁 参 考',
        path: '/guide/ref',
      },
      {
        title: '🎗 记 录',
        path: '/guide/note',
      },
      {
        title: '💬 FAQ',
        path: '/guide/faq',
      },
    ],
  },
});
