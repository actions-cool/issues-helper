---
toc: menu
---

# 🌟 进 阶

进阶用法不建议 actions 多个一次同时使用。

## `check-inactive`

每月 1 号 UTC 0 时，对所有 30 天以上未活跃的 issues 增加 `inactive` 标签。

```yml
name: Check inactive

on:
  schedule:
    - cron: "0 0 1 * *"

jobs:
  check-inactive:
    runs-on: ubuntu-latest
    steps:
      - name: check-inactive
        uses: actions-cool/issues-helper@v1.8
        with:
          actions: 'check-inactive'
          token: ${{ secrets.GITHUB_TOKEN }}
          inactive-day: 30
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ |
| contents | 为该评论增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |
| labels | 标签筛选 | string | ✖ |
| issue-state | 状态筛选 | string | ✖ |
| issue-assignee | 指定人筛选 | string | ✖ |
| issue-creator | 创建人筛选 | string | ✖ |
| issue-mentioned | 提及人筛选 | string | ✖ |
| body-includes | 包含内容筛选 | string | ✖ |
| title-includes | 包含标题筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |
| inactive-label | 新增标签名称 | string | ✖ |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-state`：默认为 `all`。可选值 `open` `closed`，非这 2 项时，均为 `all`
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有
- `inactive-label`：默认为 `inactive`，可自定义其他。当项目未包含该 label 时，会自动新建

## `check-issue`

根据传入的参数和 `issue-number` 来检查该 issue 是否满足条件，返回一个布尔值。

下面的例子效果是：当 issue 新开时，校验当前 issue 指定人是否包含 `x1` 或者 `x2`，满足一个指定人即可校验通过，同时校验标题是否满足条件，[校验规则](/guide/ref#-includes-校验规则)。

```yml
name: Check Issue

on:
  issues:
    types: [edited]

jobs:
  check-issue:
    runs-on: ubuntu-latest
    steps:
      - name: check-issue
        uses: actions-cool/issues-helper@v1.8
        with:
          actions: 'check-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignee-includes: 'x1,x2'
          title-includes: 'x1,x2/y1,y2'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| assignee-includes | 是否包含指定人 | string | ✖ |
| title-includes | 标题包含校验 | string | ✖ |
| body-includes | 内容包含校验 | string | ✖ |

- `title-includes` `body-includes` 支持格式 `x1,x2` 或者 `x1,x2/y1,y2`。只支持两个层级
- 返回 `check-result`，由于 yml 原因，判断条件为 `if: steps.xxid.outputs.check-result == 'true'`

## `close-issues`

每 7 天 UTC 0 时，关闭已填加 `need info` label 且 7 天以上未活跃的 issues。

```yml
name: Check need info

on:
  schedule:
    - cron: "0 0 */7 * *"

jobs:
  check-need-info:
    runs-on: ubuntu-latest
    steps:
      - name: close-issues
        uses: actions-cool/issues-helper@v1.8
        with:
          actions: 'close-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'need info'
          inactive-day: 7
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ |
| contents | 为该评论增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |
| labels | 标签筛选 | string | ✖ |
| issue-assignee | 指定人筛选 | string | ✖ |
| issue-creator | 创建人筛选 | string | ✖ |
| issue-mentioned | 提及人筛选 | string | ✖ |
| body-includes | 包含内容筛选 | string | ✖ |
| title-includes | 包含标题筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有

## `find-comments`

查找当前仓库 1 号 issue 中，创建者是 k ，内容包含 `this` 的评论列表。

```yml
- name: Find comments
    uses: actions-cool/issues-helper@v1.8
    with:
      actions: 'find-comments'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: 1
      comment-auth: 'k'
      body-includes: 'this'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| comment-auth | 评论创建者，不填时会查询所有 | string | ✖ |
| body-includes | 评论内容包含过滤，不填时无校验 | string | ✖ |
| direction | 返回 `comments` 排序 | string | ✖ |

- 返回 `comments`，格式如下：

```js
[
  {id: 1, auth: 'x', body: 'xxx', created: '', updated: ''},
  {id: 2, auth: 'x', body: 'xxx', created: '', updated: ''},
]
```

- `direction` 默认为升序，只有设置 `desc` 时，会返回降序
- 返回数组中 `created` `updated`，由所处环境决定，会是 UTC +0

## `lock-issues`

每 3 个月 1 号 UTC 0 时，锁定已填加 `inactive` label 且 128 天以上未活跃的所有 issues。

```yml
name: Lock inactive issues

on:
  schedule:
    - cron: "0 0 1 */3 *"

jobs:
  lock-issues:
    runs-on: ubuntu-latest
    steps:
      - name: lock-issues
        uses: actions-cool/issues-helper@v1.8
        with:
          actions: 'lock-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'inactive'
          inactive-day: 128
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ |
| contents | 为该评论增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |
| labels | 标签筛选 | string | ✖ |
| issue-state | 状态筛选 | string | ✖ |
| issue-assignee | 指定人筛选 | string | ✖ |
| issue-creator | 创建人筛选 | string | ✖ |
| issue-mentioned | 提及人筛选 | string | ✖ |
| body-includes | 包含内容筛选 | string | ✖ |
| title-includes | 包含标题筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-state`：默认为 `all`。可选值 `open` `closed`，非这 2 项时，均为 `all`
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有

## `month-statistics`

每月 1 号 1 时，生成一个 issue 上月统计。

```
name: Issue Month Statistics

on:
  schedule:
    - cron: "0 1 1 * *"

jobs:
  month-statistics:
    runs-on: ubuntu-latest
    steps:
      - name: month-statistics
        uses: actions-cool/issues-helper@v1.8
        with:
          actions: 'month-statistics'
          token: ${{ secrets.GITHUB_TOKEN }}
          count-lables: 'true'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| labels | 为新增 issue 添加 labels | string | ✖ |
| assignees | 为新增 issue 添加 assignees | string | ✖ |
| count-lables | 新增 issue 是否统计 labels | string | ✖ |
| count-comments | 新增 issue 是否统计 comments | string | ✖ |

- 新增 `issue` 的标题默认为 `[当前仓库] Month Statistics: 年-月`
- `count-lables`：可设置 `'true'`，增加 labels 统计
- `count-comments`：可设置 `'true'`，增加 comments 统计

如下所示：

![](../public/month.png)
