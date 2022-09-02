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

## `yml` 中传值和输出

```
with:
  actions: 'month-statistics'
  token: ${{ secrets.GITHUB_TOKEN }}
  count-lables: 'true'
```

- `count-lables`：不管设置 `true` 还是 `'ture'`，在程序里接收到的都是字符串格式

同时输出的也是字符串格式。[参看](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idoutputs)。

- `check-result`：判断条件为 `if: steps.xxid.outputs.check-result == 'true'`

## `GitHub Actions bot` 触发

当设置了一个 Actions，如为给一个 issue 新增 label `x1` 时，Actions 自动为该 issue 增加 `x2` label。

但如果这个是由 `GitHub Actions bot` 完成的（即 actions 中 token 不传，或使用默认 `token: ${{ secrets.GITHUB_TOKEN }}`），则不会触发 label `x2` 的 Actions。

ref: [GitHub docs](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#triggering-new-workflows-using-a-personal-access-token)

## `assignees` 范围

- 仓库的所有者或协作者，若有组织，包括成员
- issue 的参与者，包括创建者、评论者
- 最多支持 10 个

## 运行基准

比如：我用 Tag 触发一个 Action，触发基准的代码就会走这个 Tag 对应代码的 Action 定义，而非主分支代码。
