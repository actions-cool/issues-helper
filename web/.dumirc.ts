// more config: https://d.umijs.org/config
import { defineConfig } from 'dumi';

const name = 'issues-helper';

const isProdSite =
  // 不是预览模式 同时是生产环境
  process.env.PREVIEW !== 'true' && process.env.NODE_ENV === 'production';

const logo =
  'https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*8xDgSL-O6O4AAAAAAAAAAAAAARQnAQ';

export default defineConfig({
  title: 'Issues Helper',
  outputPath: '../docs-dist',
  base: isProdSite ? `/${name}/` : '/',
  publicPath: isProdSite ? `/${name}/` : '/',
  locales: [
    { id: 'en-US', name: 'English', },
    { id: 'zh-CN', name: '中文' },
  ],
  favicons: [logo],
  themeConfig: {
    logo,
    nav: {
      'zh-CN': [
        { title: '指 南', link: '/zh-CN/guide' },
        { title: '基 础', link: '/zh-CN/base' },
        { title: '进 阶', link: '/zh-CN/advanced' },
        { title: '更新日志', link: '/zh-CN/changelog' }
      ],
      'en-US': [
        { title: 'Guide', link: '/guide' },
        { title: 'Base', link: '/base' },
        { title: 'Advanced', link: '/advanced' },
        { title: 'Changelog', link: '/changelog' },
      ],
    },
    socialLinks: {
      github: 'https://github.com/actions-cool/issues-helper'
    },
    footer: 'Open-source MIT Licensed | Copyright © 2020-present<br />Powered by xrkffgg'
  },
});
