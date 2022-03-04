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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'check-inactive'
          token: ${{ secrets.GITHUB_TOKEN }}
          inactive-day: 30
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ |
| emoji | 为该评论增加 [emoji](/guide/ref#-emoji-类型) | string | ✖ |
| labels | 标签筛选 | string | ✖ |
| issue-state | 状态筛选 | string | ✖ |
| issue-assignee | 指定人筛选 | string | ✖ |
| issue-creator | 创建人筛选 | string | ✖ |
| issue-mentioned | 提及人筛选 | string | ✖ |
| body-includes | 包含内容筛选 | string | ✖ |
| title-includes | 包含标题筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |
| inactive-label | 新增标签名称 | string | ✖ |
| exclude-labels | 排除标签筛选 | string | ✖ |

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
        uses: actions-cool/issues-helper@v3
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
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| issue-number | 指定的 issue，当不传时会从触发事件中获取 | number | ✖ |
| assignee-includes | 是否包含指定人 | string | ✖ |
| title-includes | 标题包含校验 | string | ✖ |
| title-excludes | 检测标题移除默认 title 后是否为空 | string | ✖ |
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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'close-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'need info'
          inactive-day: 7
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ |
| emoji | 为该评论增加 [emoji](/guide/ref#-emoji-类型) | string | ✖ |
| labels | 标签筛选 | string | ✖ |
| issue-assignee | 指定人筛选 | string | ✖ |
| issue-creator | 创建人筛选 | string | ✖ |
| issue-mentioned | 提及人筛选 | string | ✖ |
| body-includes | 包含内容筛选 | string | ✖ |
| title-includes | 包含标题筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |
| exclude-labels | 排除标签筛选 | string | ✖ |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有

## `find-comments`

查找当前仓库 1 号 issue 中，创建者是 k ，内容包含 `this` 的评论列表。

```yml
- name: Find comments
    uses: actions-cool/issues-helper@v3
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
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| issue-number | 指定的 issue，当不传时会从触发事件中获取 | number | ✖ |
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

## `find-issues`

查找当前仓库，创建者是 k ，title 包含 `this` ，body 包含 `that`，打开状态的 issues 列表。

```yml
- name: Find issues
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'find-issues'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-creator: 'k'
      issue-state: 'open'
      title-includes: 'this'
      body-includes: 'that'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| issue-state | 状态筛选 | string | ✖ |
| issue-creator | 创建者筛选 | string | ✖ |
| title-includes | 标题包含过滤，不填时无校验 | string | ✖ |
| body-includes | 内容包含过滤，不填时无校验 | string | ✖ |
| exclude-labels | 排除标签筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |
| direction | 返回 `issues` 排序 | string | ✖ |

- 返回 `issues`，格式如下：

```js
[
  {number: 1, auth: 'x', body: 'xxx', body: 'xxx', state: 'open', created: '', updated: ''},
  {number: 2, auth: 'x', body: 'xxx', body: 'xxx', state: 'closed', created: '', updated: ''},
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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'lock-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'inactive'
          inactive-day: 128
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ |
| emoji | 为该评论增加 [emoji](/guide/ref#-emoji-类型) | string | ✖ |
| labels | 标签筛选 | string | ✖ |
| issue-state | 状态筛选 | string | ✖ |
| issue-assignee | 指定人筛选 | string | ✖ |
| issue-creator | 创建人筛选 | string | ✖ |
| issue-mentioned | 提及人筛选 | string | ✖ |
| body-includes | 包含内容筛选 | string | ✖ |
| title-includes | 包含标题筛选 | string | ✖ |
| inactive-day | 非活跃天数筛选 | number | ✖ |
| lock-reason | 锁定 issue 的原因 | string | ✖ |
| exclude-labels | 排除标签筛选 | string | ✖ |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-state`：默认为 `all`。可选值 `open` `closed`，非这 2 项时，均为 `all`
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有

## `mark-assignees`

快捷加指定人，仅作用于 issue 新增编辑评论。

```yml
name: Issue Mark Assignees

on:
  issue_comment:
    types: [created, edited]

jobs:
  mark-assignees:
    runs-on: ubuntu-latest
    steps:
      - name: mark-assignees
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'mark-assignees'
          token: ${{ secrets.GITHUB_TOKEN }}
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| assign-command | 可设置简洁命令，如：`/a` | string | ✖ |
| require-permission | 要求权限，默认为 `write` | string | ✖ |

- `assign-command`：可设置简洁命令。默认：`/assign`
- `require-permission`：可选值有 `admin`，`write`，`read`，`none`
  - 团队成员若设置 `read` 权限，则为 `read`
  - 外部 Collaborator 若设置 `read` 权限，则为 `read`
  - 普通用户为 `read` 权限
  - 当设置 `write` 后，`admin` 和 `write` 满足条件

## `mark-duplicate`

快捷标记重复问题，仅作用于 issue 新增编辑评论。

```yml
name: Issue Mark Duplicate

on:
  issue_comment:
    types: [created, edited]

jobs:
  mark-duplicate:
    runs-on: ubuntu-latest
    steps:
      - name: mark-duplicate
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'mark-duplicate'
          token: ${{ secrets.GITHUB_TOKEN }}
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✖ |
| duplicate-command | 可设置简洁命令，如：`/d` | string | ✖ |
| duplicate-labels | 为该 issue 额外增加 labels | string | ✖ |
| remove-labels | 设置可移除的 labels | string | ✖ |
| labels | 替换该 issue 的 labels | string | ✖ |
| emoji | 为该评论的增加 [emoji](/guide/ref#-emoji-类型) | string | ✖ |
| close-issue | 是否同时关闭该 issue | string | ✖ |
| require-permission | 要求权限，默认为 `write` | string | ✖ |

- `duplicate-command`：当设置简洁命令时，同时仍支持原有 `Duplicate of`。屏蔽内容包含 `?`
- `labels`：优先级最高
- `close-issue`：`true` 或 `'true'` 均可生效
- `require-permission`：可选值有 `admin`，`write`，`read`，`none`
  - 团队成员若设置 `read` 权限，则为 `read`
  - 外部 Collaborator 若设置 `read` 权限，则为 `read`
  - 普通用户为 `read` 权限
  - 当设置 `write` 后，`admin` 和 `write` 满足条件

<Alert>
注意：使用简洁命令创建的 Duplicate 不显示下图红框内容。但其实这个没有任何影响的。
</Alert>

![](https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*PN2tS7PjDQ4AAAAAAAAAAAAAARQnAQ)

## `welcome`

当一个 issue 新建时，对首次新建 issue 的用户进行欢迎。若用户非首次新建，则无操作。

```yml
name: Issue Welcome

on:
  issues:
    types: [opened]

jobs:
  issue-welcome:
    runs-on: ubuntu-latest
    steps:
      - name: welcome
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'welcome'
          token: ${{ secrets.GITHUB_TOKEN }}
          body: hi @${{ github.event.issue.user.login }}, welcome!
          labels: 'welcome1, welcome2'
          assignees: 'xx1'
          issue-emoji: '+1, -1, eyes'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明)  | string | ✔ |
| body | 评论欢迎的内容，不填则不评论 | string | ✖ |
| labels | 为该 issue 增加 labels | string | ✖ |
| assignees | 为该 issue 增加 assignees | string | ✖ |
| issue-emoji | 为该 issue 增加 [emoji](/guide/ref#-emoji-类型) | string | ✖ |

- 若这 4 个可选项都不填，则无操作
