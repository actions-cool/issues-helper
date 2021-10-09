---
toc: menu
---

# ✨ 更新日志

- 版本规则
  - 采用两级语义化版本，如v1、v1.1、v2、v2.1
  - v1 表示初始版本
  - 对 v1 版本的修复和新增会发布到 v1.1 版本
  - 当发布的 v1.x 运行一定时间稳定或进行重构时，发布进阶 v2.x 版本
  - v2 版本后会严格按照三级语义来发布版本，如 v2.0.0、v2.1.0

- 版本选择
  - 建议采用最新 releases 版本。可在 [releases](https://github.com/actions-cool/issues-helper/releases) 看到
  - 同时也可参照下面的更新日志来选择版本
  - 最新的 v1.x release 代码会合并到 1.x 分支中
  - v2 版本后支持使用 v2 tag，将同步最新 2.x 代码
  - 支持直接使用分支版本。如：

```yml
- name: Issues Helper
  uses: actions-cool/issues-helper@main

# or

- name: Issues Helper
  uses: actions-cool/issues-helper@1.x

# or

- name: Issues Helper
  uses: actions-cool/issues-helper@v2
```

- v2 [升级参考](/guide/faq)

<embed src="../../CHANGELOG.md"></embed>
