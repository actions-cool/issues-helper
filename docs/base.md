---
toc: menu
---

为了更好的展示功能，下面以实际场景举例，请灵活参考。

# ⭐ 基 础

## `add-assignees`

当一个 issue 新增或修改时，将这个 issue 指定某人或多人。

```yml
name: Add Assigness

on:
  issues:
    types: [opened, edited]

jobs:
  add-assigness:
    runs-on: ubuntu-latest
    steps:
      - name: Add assigness
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'add-assignees'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignees: 'xxx' or 'xx1,xx2'
          random-to: 1
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| assignees | 指定人。当不填或者为空字符时，不操作 | string | ✖ |
| random-to | 当设置时，会在 assignees 中随机选择 | number | ✖ |

- `actions` 支持多个，需用逗号隔开。如：`add-assignees,add-labels`
- 其中的 `name` 可根据自行根据实际情况修改
- [on 参考](/guide/ref#-github-相关文档)
- `${{ github.event.issue.number }}` 表示当前 issue，[更多参考](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events)
- `assignees` 支持多个，需用逗号隔开

## `add-labels`

当一个新增的 issue 内容不包含指定格式时，为这个 issue 添加 labels。

```yml
name: Add Labels

on:
  issues:
    types: [opened]

jobs:
  add-labels:
    runs-on: ubuntu-latest
    if: contains(github.event.issue.body, 'xxx') == false
    steps:
      - name: Add labels
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'add-labels'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          labels: 'bug' or 'bug1,bug2'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| labels | 新增的 labels。当不填或者为空字符时，不新增 | string | ✖ |

- `labels` 支持多个，需用逗号隔开

## `close-issue`

关闭指定 issue。

```yml
- name: Close issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'close-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
      body: 'This is auto closed.'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |

## `create-comment`

当新增一个指定 label 时，对该 issue 进行评论。

```yml
name: Create Comment

on:
  issues:
    types: [labeled]

jobs:
  create-comment:
    runs-on: ubuntu-latest
    if: github.event.label.name == 'xxx'
    steps:
      - name: Create comment
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello ${{ github.event.issue.user.login }}. Add some comments.

            你好 ${{ github.event.issue.user.login }}。巴拉巴拉。
          contents: '+1' or '+1,heart'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| body | 新增评论的内容  | string | ✖ |
| contents | 为新增评论的增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |

- `body` 默认为：`Currently at ${owner}/${repo}. And this is default comment.`
  - 其中 `${owner}/${repo}` 表示当前仓库
- 返回 `comment-id`，可用于之后操作。[用法参考](/guide/ref#-outputs-使用)
- `${{ github.event.issue.user.login }}` 表示该 issue 的创建者
- `contents` 支持多个，需用逗号隔开

## `create-issue`

感觉新增 issue 使用场景不多。这里举例，每月 1 号 UTC 00:00 新增一个 issue。

```yml
name: Create Issue

on:
  schedule:
    - cron: "0 0 1 * *"

jobs:
  create-issue:
    runs-on: ubuntu-latest
    steps:
      - name: Create issue
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'create-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          title: 'xxxx'
          body: 'xxxx'
          labels: 'xx'
          assignees: 'xxx'
          contents: '+1'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| title | 新增 issue 的标题 | string | ✖ |
| body | 新增 issue 的内容 | string | ✖ |
| labels | 为新增 issue 添加 labels | string | ✖ |
| assignees | 为新增 issue 添加 assignees | string | ✖ |
| random-to | 当设置时，会在 assignees 中随机选择 | number | ✖ |
| contents | 为新增 issue 增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |

- `title` 默认为：`Default Title`
- 返回 `issue-number`，[用法参考](/guide/ref#-outputs-使用)

## `delete-comment`

根据 [`comment-id`](/guide/ref#-comment-id) 删除指定评论。

```yml
- name: Delete comment
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'delete-comment'
      token: ${{ secrets.GITHUB_TOKEN }}
      comment-id: xxx
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| comment-id | 指定的 comment | number | ✔ |

## `lock-issue`

当新增 `invalid` label 时，对该 issue 进行锁定。

```yml
name: Lock Issue

on:
  issues:
    types: [labeled]

jobs:
  lock-issue:
    runs-on: ubuntu-latest
    if: github.event.label.name == 'invalid'
    steps:
      - name: Lock issue
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'lock-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |

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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'mark-duplicate'
          token: ${{ secrets.GITHUB_TOKEN }}
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| duplicate-command | 可设置简洁命令，如：`/d` | string | ✖ |
| duplicate-labels | 为该 issue 额外增加 labels | string | ✖ |
| remove-labels | 设置可移除的 labels | string | ✖ |
| labels | 替换该 issue 的 labels | string | ✖ |
| contents | 为该评论的增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |
| close-issue | 是否同时关闭该 issue | string | ✖ |

- `duplicate-command`：当设置简洁命令时，同时仍支持原有 `Duplicate of`。屏蔽内容包含 `?`
- `labels`：优先级最高
- `close-issue`：`true` 或 `'true'` 均可生效

<Alert>
注意：使用简洁命令创建的 Duplicate 不显示下图红框内容。但其实这个没有任何影响的。
</Alert>

![](../public/duplicate.png)

## `open-issue`

打开指定 issue。

```yml
- name: Open issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'open-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |

## `remove-assignees`

移除 issue 指定人员。

```yml
- name: Remove assignees
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'remove-assignees'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      assignees: 'xx'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| assignees | 移除的指定人。当为空字符时，不进行移除 | string | ✔ |

## `remove-labels`

移除指定 labels。

```yml
- name: Remove labels
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'remove-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| labels | 移除的 labels。当为空字符时，不进行移除 | string | ✔ |

- `labels` 支持多个，如 `x1,x2,x3`，只会移除 issue 已添加的 labels

## `set-labels`

替换 issue 的 labels。

```yml
- name: Set labels
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'set-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| labels | labels 设置。当空字符时，会移除所有 | string | ✔ |

## `unlock-issue`

解锁指定 issue。

```yml
- name: Unlock issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'unlock-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |

## `update-comment`

根据 [`comment-id`](/guide/ref#-comment-id) 更新指定评论。

下面的例子展示的是，为每个新增的 comment 增加 👀 。

```yml
name: Add eyes to each comment

on:
  issue_comment:
    types: [created]

jobs:
  update-comment:
    runs-on: ubuntu-latest
    steps:
      - name: Update comment
          uses: actions-cool/issues-helper@v1.11
          with:
            actions: 'update-comment'
            token: ${{ secrets.GITHUB_TOKEN }}
            comment-id: ${{ github.event.comment.id }}
            contents: 'eyes'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| comment-id | 指定的 comment | number | ✔ |
| body | 更新 comment 的内容 | string | ✖ |
| update-mode | 更新模式。默认 `replace` 替换，`append` 附加 | string | ✖ |
| contents | 增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |

- `body` 不填时，会保持原有
- `update-mode` 为 `append` 时，会进行附加操作。非 `append` 都会进行替换。仅对 `body` 生效

## `update-issue`

根据 `issue-number` 更新指定 issue。

```yml
- name: Update issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'update-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      state: 'open'
      title: 'xxx'
      body: 'xxxx'
      update-mode: 'replace'
      labels: 'xx'
      assignees: 'xxx'
      contents: '+1'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明) | string | ✔ |
| issue-number | 指定的 issue | number | ✔ |
| state | 修改 issue 的状态，可选值 `open` `closed` | string | ✖ |
| title | 修改 issue 的标题 | string | ✖ |
| body | 修改 issue 的内容 | string | ✖ |
| update-mode | 更新模式。默认 `replace` 替换，`append` 附加 | string | ✖ |
| labels | 替换 issue 的 labels | string | ✖ |
| assignees | 替换 issue 的 assignees | string | ✖ |
| contents | 增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |

- `state` 默认为 `open`
- 当可选项不填时，会保持原有


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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'welcome'
          token: ${{ secrets.GITHUB_TOKEN }}
          body: hi @${{ github.event.issue.user.login }}, welcome!
          labels: 'welcome1, welcome2'
          assignees: 'xx1'
          issue-contents: '+1, -1, eyes'
```

| 参数 | 描述 | 类型 | 必填 |
| -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ |
| token | [token 说明](/guide/ref#-token-说明)  | string | ✔ |
| body | 评论欢迎的内容，不填则不评论 | string | ✖ |
| labels | 为该 issue 增加 labels | string | ✖ |
| assignees | 为该 issue 增加 assignees | string | ✖ |
| issue-contents | 为该 issue 增加 [reaction](/guide/ref#-reactions-类型) | string | ✖ |

- 若这 4 个可选项都不填，则无操作