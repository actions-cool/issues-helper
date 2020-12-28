---
toc: menu
---

## 该功能是否收费？

GitHub Actions 是由 GitHub 免费提供的。其中 `Private` 项目每月有 2000 次的限制，[具体查看](https://github.com/settings/billing)。`Public` 项目无限制。

## 有没有现成的模板可以参考？

有的。

1. 你可以使用这个 [GitHub Actions workflow template](https://github.com/actions-cool/.github) 仓库的模板
2. 个人练习和测试 [Actions](https://github.com/xrkffgg/test-ci) 的仓库
3. 也可以来 [线上使用者](/#-谁在使用？) 的仓库参照

## 我想暂停 Actions，有没有简单的办法？

有的，你可以将直接修改 `actions`。例如：`actions: 'create-comment'` 修改为 `actions: '#create-comment'`。同时也方便恢复。

## 这么多版本，如何选择？

你可以查看详细的 [更新日志](/changelog)。推荐采用最新 releases 版本。

## 如果这里没有我想要的功能，该怎么办？

你可以在 [What do you want?](https://github.com/actions-cool/issues-helper/discussions/18) 中提出。
