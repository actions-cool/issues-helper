---
toc: menu
---

<Alert type="success">
这里记录自己在使用中总结的一些东西，希望可以帮助到你。
</Alert>

## `yml` 中包含判断

```yml
if: contains(github.event.issue.body, 'ie') == false
```

- 当 issue body 不包含 `ie` 触发
- 测试 yml 中不支持 js `includes()` 语法
- 大小写不校验，`IE` 还有同时类似 `kiekk` 也可满足

更多[查看](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#functions)。

## `GitHub Actions bot` 触发

当设置了一个 Actions，如为给一个 issue 新增 label `x1` 时，Actions 自动为该 issue 增加 `x2` label。

但如果这个是由 `GitHub Actions bot` 完成的（即 actions 中 token 不传，或使用默认 `token: ${{ secrets.GITHUB_TOKEN }}`），则不会触发 label `x2` 的 Actions。
