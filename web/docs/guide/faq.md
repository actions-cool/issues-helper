---
toc: menu
---

## 该功能是否收费？

GitHub Actions 是由 GitHub 免费提供的。其中 `Private` 项目每月有 2000 次的限制，[具体查看](https://github.com/settings/billing)。`Public` 项目无限制。

### 有没有速率的限制？

有的。Action 底层使用的是 GitHub REST API。一般情况是每小时 5000 次。原则上基本是够用的，同时也要求在 Action 定义时，尽量避免无效的请求。[具体查看](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)。

## 有没有现成的模板可以参考？

有的。

1. 你可以使用这个 [GitHub Actions workflow template](https://github.com/actions-cool/.github) 仓库的模板
2. 个人练习和测试 [Actions](https://github.com/actions-cool/test-issues-helper) 的仓库
3. 也可以来 [线上使用者](/#-谁在使用？) 的仓库参照

## 我想暂停 Actions，有没有简单的办法？

有的，你可以将直接修改 `actions`。例如：`actions: 'create-comment'` 修改为 `actions: '#create-comment'`。同时也方便恢复。

## 这么多版本，如何选择？

你可以查看详细的 [更新日志](/changelog)。推荐采用最新 releases 版本。

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
  uses: actions-cool/issues-helper@v3
```

## 从 v1.x 升级到 v2，有什么注意的地方吗？

v1.12 和 v2.0.0 版本的差别只有一处。即 `mark-duplicate` 中的 `require-permission` 增加了默认值 `write`。

## v3 变更

🚀 v3 版本重构完成，主要变更内容：

1. JS to TS
2. 将 issue 核心功能封装成为类供 helper 使用
3. 提示信息统一
4. 增加自动发布脚本

功能变更参考：

- 🚀 New Feature
  - `mark-assignees`: 评论快捷设置 assignees
  - `find-issues`: 条件查询当前仓库 issues
- 🐞 Bug Fix
  - 修复 `find-comments` 返回结果 direction 未起作用
  - 修复 `lock-issues` lock 与 comment 的顺序问题
- 🛠 Refactor
  - contents 更名为容易理解的 emoji
  - `issue-emojis` 更名为 `issue-emoji`
  - deleteComment updateComment 不再支持 `out-comments`，保持纯粹功能
  - 移除 title body 默认值
  - `month-statistics` 移除

## 如果这里没有我想要的功能，该怎么办？

你可以在 issues 中提出。
