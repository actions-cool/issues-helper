# 🤖 Issues 助手

简体中文 | [English](./README.en-US.md)

[![](https://img.shields.io/github/workflow/status/actions-cool/issues-helper/ci?style=flat-square)](https://github.com/actions-cool/issues-helper/actions)
[![](https://img.shields.io/badge/marketplace-issues--helper-red?style=flat-square)](https://github.com/marketplace/actions/issues-helper)
[![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi)
[![](https://img.shields.io/github/v/release/actions-cool/issues-helper?style=flat-square&color=orange)](https://github.com/actions-cool/issues-helper/releases)
[![](https://img.shields.io/badge/discussions-on%20github-blue?style=flat-square&color=%2308979c)](https://github.com/actions-cool/issues-helper/discussions)
[![](https://img.shields.io/github/stars/actions-cool/issues-helper?style=flat-square)](https://github.com/actions-cool/issues-helper/stargazers)
[![](https://img.shields.io/github/license/actions-cool/issues-helper?style=flat-square)](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)

一个轻松帮你自动管理 issues 的 GitHub Action

[在线文档](https://actions-cool.github.io/issues-helper/) | [更新日志](https://actions-cool.github.io/issues-helper/changelog)

## 😎 为什么用 GitHub Action？

1. 完全免费
2. 全自动操作
3. 托管于 GitHub 服务器，只要 GitHub 不宕机，它就不受影响

> Private 项目每月有 2000 次的限制，[具体查看](https://github.com/settings/billing)。Public 项目无限制。

## 列 表

当以下列表没有你想要的功能时，可以在 [What do you want?](https://github.com/actions-cool/issues-helper/discussions/18) 中提出。

- ⭐ 基 础
  - [`add-assignees`](#add-assignees)
  - [`add-labels`](#add-labels)
  - [`close-issue`](#close-issue)
  - [`create-comment`](#create-comment)
  - [`create-issue`](#create-issue)
  - [`delete-comment`](#delete-comment)
  - [`lock-issue`](#lock-issue)
  - [`open-issue`](#open-issue)
  - [`remove-assignees`](#remove-assignees)
  - [`remove-labels`](#remove-labels)
  - [`set-labels`](#set-labels)
  - [`unlock-issue`](#unlock-issue)
  - [`update-comment`](#update-comment)
  - [`update-issue`](#update-issue)
  - [`welcome`](#welcome)
- ⭐ 进 阶
  - [`check-inactive`](#check-inactive)
  - [`check-issue`](#check-issue)
  - [`close-issues`](#close-issues)
  - [`find-comments`](#find-comments)
  - [`lock-issues`](#lock-issues)
- 🌰 例 子
  - [`find-comments + create-comment + update-comment`](#find-comments--create-comment--update-comment)

## 🚀 使 用

### ⭐ 基 础

为了更好的展示功能，下面以实际场景举例，请灵活参考。

#### `add-assignees`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'add-assignees'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignees: 'xxx' or 'xx1,xx2'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| assignees | 指定人。当不填或者为空字符时，不操作 | string | ✖ | v1.1 |

- `actions` 支持多个，需用逗号隔开。如：`add-assignees,add-labels`
- 其中的 `name` 可根据自行根据实际情况修改
- [on 参考](#github-docs)
- `${{ github.event.issue.number }}` 表示当前 issue，[更多参考](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events)
- `assignees` 支持多个，需用逗号隔开。注意设置多个，需使用v1.1以上版本

⏫ [返回列表](#列-表)

#### `add-labels`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'add-labels'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          labels: 'bug' or 'bug1,bug2'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| labels | 新增的 labels。当不填或者为空字符时，不新增 | string | ✖ | v1.1 |

- `labels` 支持多个，需用逗号隔开。注意设置多个，需使用v1.1以上版本

⏫ [返回列表](#列-表)

#### `close-issue`

关闭指定 issue。

```yml
- name: Close issue
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'close-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
      body: 'This is auto closed.'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |

⏫ [返回列表](#列-表)

#### `create-comment`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello ${{ github.event.issue.user.login }}. Add some comments.

            你好 ${{ github.event.issue.user.login }}。巴拉巴拉。
          contents: '+1' or '+1,heart'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| body | 新增评论的内容  | string | ✖ | v1 |
| contents | 为新增评论的增加 [reaction](#reactions-types) | string | ✖ | v1.1 |

- `body` 默认为：`Currently at ${owner}/${repo}. And this is default comment.`
  - 其中 `${owner}/${repo}` 表示当前仓库
- 返回 `comment-id`，可用于之后操作。[用法参考](#outputs-使用)
- `${{ github.event.issue.user.login }}` 表示该 issue 的创建者
- `contents` 支持多个，需用逗号隔开。注意设置多个，需使用v1.1以上版本

⏫ [返回列表](#列-表)

#### `create-issue`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'create-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          title: 'xxxx'
          body: 'xxxx'
          labels: 'xx'
          assignees: 'xxx'
          contents: '+1'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| title | 新增 issue 的标题 | string | ✖ | v1 |
| body | 新增 issue 的内容 | string | ✖ | v1 |
| labels | 为新增 issue 添加 labels | string | ✖ | v1.1 |
| assignees | 为新增 issue 添加 assignees | string | ✖ | v1.1 |
| contents | 为新增 issue 增加 [reaction](#reactions-types) | string | ✖ | v1.1 |

- `title` 默认为：`Default Title`
- 返回 `issue-number`，[用法参考](#outputs-使用)

⏫ [返回列表](#列-表)

#### `delete-comment`

根据 [`comment-id`](#comment-id) 删除指定评论。

```yml
- name: Delete comment
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'delete-comment'
      token: ${{ secrets.GITHUB_TOKEN }}
      comment-id: xxx
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| comment-id | 指定的 comment | number | ✔ | v1 |

⏫ [返回列表](#列-表)

#### `lock-issue`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'lock-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |

⏫ [返回列表](#列-表)

#### `open-issue`

打开指定 issue。

```yml
- name: Open issue
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'open-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |

⏫ [返回列表](#列-表)

#### `remove-assignees`

移除 issue 指定人员。

```yml
- name: Remove assignees
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'remove-assignees'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      assignees: 'xx'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| assignees | 移除的指定人。当为空字符时，不进行移除 | string | ✔ | v1.1 |

⏫ [返回列表](#列-表)

#### `remove-labels`

移除指定 labels。

```yml
- name: Remove labels
    uses: actions-cool/issues-helper@v1.2
    with:
      actions: 'remove-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1.2 |
| token | [token 说明](#token) | string | ✔ | v1.2 |
| issue-number | 指定的 issue | number | ✔ | v1.2 |
| labels | 移除的 labels。当为空字符时，不进行移除 | string | ✔ | v1.2 |

- `labels` 支持多个，如 `x1,x2,x3`，只会移除 issue 已添加的 labels

⏫ [返回列表](#列-表)

#### `set-labels`

替换 issue 的 labels。

```yml
- name: Set labels
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'set-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| labels | labels 设置。当空字符时，会移除所有 | string | ✔ | v1.1 |

⏫ [返回列表](#列-表)

#### `unlock-issue`

解锁指定 issue。

```yml
- name: Unlock issue
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'unlock-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |

⏫ [返回列表](#列-表)

#### `update-comment`

根据 [`comment-id`](#comment-id) 更新指定评论。

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
          uses: actions-cool/issues-helper@v1
          with:
            actions: 'update-comment'
            token: ${{ secrets.GITHUB_TOKEN }}
            comment-id: ${{ github.event.comment.id }}
            contents: 'eyes'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| comment-id | 指定的 comment | number | ✔ | v1 |
| body | 更新 comment 的内容 | string | ✖ | v1 |
| update-mode | 更新模式。默认 `replace` 替换，`append` 附加 | string | ✖ | v1 |
| contents | 增加 [reaction](#reactions-types) | string | ✖ | v1.1 |

- `body` 不填时，会保持原有
- `update-mode` 为 `append` 时，会进行附加操作。非 `append` 都会进行替换。仅对 `body` 生效

⏫ [返回列表](#列-表)

#### `update-issue`

根据 `issue-number` 更新指定 issue。

```yml
- name: Update issue
    uses: actions-cool/issues-helper@v1
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

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| state | 修改 issue 的状态，可选值 `open` `closed` | string | ✖ | v1 |
| title | 修改 issue 的标题 | string | ✖ | v1 |
| body | 修改 issue 的内容 | string | ✖ | v1 |
| update-mode | 更新模式。默认 `replace` 替换，`append` 附加 | string | ✖ | v1 |
| labels | 替换 issue 的 labels | string | ✖ | v1.1 |
| assignees | 替换 issue 的 assignees | string | ✖ | v1.1 |
| contents | 增加 [reaction](#reactions-types) | string | ✖ | v1.1 |

- `state` 默认为 `open`
- 当可选项不填时，会保持原有

⏫ [返回列表](#列-表)

#### `welcome`

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
        uses: actions-cool/issues-helper@v1.3
        with:
          actions: 'welcome'
          token: ${{ secrets.GITHUB_TOKEN }}
          body: hi @${{ github.event.issue.user.login }}, welcome!
          labels: 'welcome1, welcome2'
          assignees: 'xx1'
          issue-contents: '+1, -1, eyes'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1.3 |
| token | [token 说明](#token) | string | ✔ | v1.3 |
| body | 评论欢迎的内容，不填则不评论 | string | ✖ | v1.3 |
| labels | 为该 issue 增加 labels | string | ✖ | v1.3 |
| assignees | 为该 issue 增加 assignees | string | ✖ | v1.3 |
| issue-contents | 为该 issue 增加 [reaction](#reactions-types) | string | ✖ | v1.3 |

- 若这 4 个可选项都不填，则无操作

⏫ [返回列表](#列-表)

### 🌟 进 阶

进阶用法不建议 actions 多个一次同时使用。

#### `check-inactive`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'check-inactive'
          token: ${{ secrets.GITHUB_TOKEN }}
          inactive-day: 30
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ | v1 |
| labels | 标签筛选 | string | ✖ | v1.1 |
| issue-state | 状态筛选 | string | ✖ | v1 |
| issue-assignee | 指定人筛选 | string | ✖ | v1 |
| issue-creator | 创建人筛选 | string | ✖ | v1 |
| issue-mentioned | 提及人筛选 | string | ✖ | v1 |
| body-includes | 包含内容筛选 | string | ✖ | v1 |
| title-includes | 包含标题筛选 | string | ✖ | v1 |
| inactive-day | 非活跃天数筛选 | number | ✖ | v1.2 |
| inactive-label | 新增标签名称 | string | ✖ | v1 |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-state`：默认为 `all`。可选值 `open` `closed`，非这 2 项时，均为 `all`
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有
- `inactive-label`：默认为 `inactive`，可自定义其他。当项目未包含该 label 时，会自动新建

⏫ [返回列表](#列-表)

#### `check-issue`

根据传入的参数和 `issue-number` 来检查该 issue 是否满足条件，返回一个布尔值。

下面的例子效果是：当 issue 新开时，校验当前 issue 指定人是否包含 `x1` 或者 `x2`，满足一个指定人即可校验通过，同时校验标题是否满足条件，[校验规则](#校验规则)。

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'check-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignee-includes: 'x1,x2'
          title-includes: 'x1,x2/y1,y2'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1.2 |
| token | [token 说明](#token) | string | ✔ | v1.2 |
| issue-number | 指定的 issue | number | ✔ | v1.2 |
| assignee-includes | 是否包含指定人 | string | ✖ | v1.2 |
| title-includes | 标题包含校验 | string | ✖ | v1.2 |
| body-includes | 内容包含校验 | string | ✖ | v1.2 |

- `title-includes` `body-includes` 支持格式 `x1,x2` 或者 `x1,x2/y1,y2`。只支持两个层级
- 返回 `check-result`

⏫ [返回列表](#列-表)

#### `close-issues`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'close-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'need info'
          inactive-day: 7
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ | v1 |
| labels | 标签筛选 | string | ✖ | v1.1 |
| issue-assignee | 指定人筛选 | string | ✖ | v1 |
| issue-creator | 创建人筛选 | string | ✖ | v1 |
| issue-mentioned | 提及人筛选 | string | ✖ | v1 |
| body-includes | 包含内容筛选 | string | ✖ | v1 |
| title-includes | 包含标题筛选 | string | ✖ | v1 |
| inactive-day | 非活跃天数筛选 | number | ✖ | v1.2 |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有

⏫ [返回列表](#列-表)

#### `find-comments`

查找当前仓库 1 号 issue 中，创建者是 k ，内容包含 `this` 的评论列表。

```yml
- name: Find comments
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'find-comments'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: 1
      comment-auth: 'k'
      body-includes: 'this'
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| issue-number | 指定的 issue | number | ✔ | v1 |
| comment-auth | 评论创建者，不填时会查询所有 | string | ✖ | v1 |
| body-includes | 评论内容包含过滤，不填时无校验 | string | ✖ | v1 |
| direction | 返回 `comments` 排序 | string | ✖ | v1 |

- 返回 `comments`，格式如下：

```js
[
  {id: 1, auth: 'x', body: 'xxx', created: '', updated: ''},
  {id: 2, auth: 'x', body: 'xxx', created: '', updated: ''},
]
```

- `direction` 默认为升序，只有设置 `desc` 时，会返回降序
- 返回数组中 `created` `updated`，由所处环境决定，会是 UTC +0

⏫ [返回列表](#列-表)

#### `lock-issues`

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'lock-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'inactive'
          inactive-day: 128
```

| 参数 | 描述 | 类型 | 必填 | 版本 |
| -- | -- | -- | -- | -- |
| actions | 操作类型 | string | ✔ | v1 |
| token | [token 说明](#token) | string | ✔ | v1 |
| body | 操作 issue 时，可进行评论。不填时，不评论 | string | ✖ | v1 |
| labels | 标签筛选 | string | ✖ | v1.1 |
| issue-state | 状态筛选 | string | ✖ | v1 |
| issue-assignee | 指定人筛选 | string | ✖ | v1 |
| issue-creator | 创建人筛选 | string | ✖ | v1 |
| issue-mentioned | 提及人筛选 | string | ✖ | v1 |
| body-includes | 包含内容筛选 | string | ✖ | v1 |
| title-includes | 包含标题筛选 | string | ✖ | v1 |
| inactive-day | 非活跃天数筛选 | number | ✖ | v1.2 |

- `labels`：为多个时，会查询同时拥有多个。不填时，会查询所有
- `issue-state`：默认为 `all`。可选值 `open` `closed`，非这 2 项时，均为 `all`
- `issue-assignee`：不支持多人。不填或输入 * 时，查询所有。输入 `none` 会查询未添加指定人的 issues
- `inactive-day`：当输入时，会筛选 issue 更新时间早于当前时间减去非活跃天数。不填时，会查询所有

⏫ [返回列表](#列-表)

## 🌰 例 子

灵活参考。

### `find-comments + create-comment + update-comment`

假设场景：当添加了 `watch` label 的 issue 修改时，查找是否有 k 创建的包含 `error` 的评论，如果只有一个，则更新该 comment，如果没有，则新增一个 comment。

```yml
name: Test

on:
  isssue:
    types: [edited]

jobs:
  do-test:
    runs-on: ubuntu-latest
    if: github.event.label.name == 'watch'
    steps:
      - name: find comments
        uses: actions-cool/issues-helper@v1
        id: fcid
        with:
          actions: 'find-comments'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          comment-auth: k
          body-includes: 'error'

      - name: create comment
        if: ${{ steps.fcid.outputs.comments.length == 0 }}
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: 'Some error!'

      - name: update comment
        if: ${{ steps.fcid.outputs.comments.length == 1 }}
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'update-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          comment-id: ${{ steps.fcid.outputs.comments[0].id }}
          body: 'Some error again!'
          update-mode: 'append'
```

⏫ [返回列表](#列-表)

## 🎁 参 考

### token

需拥有 push 权限的人员 token。

- [个人 token 申请](https://github.com/settings/tokens)
  - 需勾选 `Full control of private repositories`
- 项目添加 secrets
  - 选择 settings，选择 secrets，选择 `New repository secret`
  - `Name` 与 actions 中保持一致
  - `Value` 填写刚才个人申请的 token

当 actions 不填写 token 时，或项目未添加对应 secrets 时，会默认为 github-actions <kbd>bot</kbd>。[更多查看](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow)。

⏫ [返回列表](#列-表)

### `outputs` 使用

```yml
- name: Create issue
  uses: actions-cool/issues-helper@v1
  id: createissue
  with:
    actions: 'create-issue'
    token: ${{ secrets.GITHUB_TOKEN }}
- name: Check outputs
  run: echo "Outputs issue_number is ${{ steps.createissue.outputs.issue-number }}"
```

[更多查看](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/metadata-syntax-for-github-actions#outputs)。

### GitHub Docs

- [GitHub Actions 语法](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on)
- [工作流触发机制](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)

⏫ [返回列表](#列-表)

### 校验规则

```js
"title-includes": 'x1,x2'

x1
x2

"x1y3y2"  true
"y2 x1"   true
"x2"      true
"x3"      false
```

```js
"title-includes": 'x1,x2/y1,y2'

x1 + y1
x2 + y1
x1 + y2
x2 + y2

"x1y3y2"  true
"y2 x1"   true
"1x2y"    false
"x1"      false
```

⏫ [返回列表](#列-表)

### Reactions 类型

| content | emoji |
| -- | -- |
| `+1` | 👍 |
| `-1` | 👎 |
| `laugh` | 😄 |
| `confused` | 😕 |
| `heart` | ❤️ |
| `hooray` | 🎉 |
| `rocket` | 🚀 |
| `eyes` | 👀 |

⏫ [返回列表](#列-表)

### `comment-id`

点击某个评论右上角 `···` 图标，选择 `Copy link`，url 末尾数字即是 `comment_id`。

⏫ [返回列表](#列-表)

## Actions 模板

- 可直接使用这个 [GitHub Actions workflow template](https://github.com/actions-cool/.github) 仓库的模板

- 个人练习和测试 [Actions](https://github.com/xrkffgg/test-ci) 的仓库

## 💖 谁在使用？

你可以来以下项目进行参考。欢迎在 [**这里**](https://github.com/actions-cool/issues-helper/issues/6) 留言。

同时，如果你在使用过程中有什么疑问，也可以在 issue 或者 discussion 中进行提问和查询。

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ant-design/ant-design">
        <img src="https://avatars1.githubusercontent.com/u/12101536?s=200&v=4" width="46" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/vueComponent/ant-design-vue">
        <img src="https://avatars2.githubusercontent.com/u/32120805?s=200&v=4" width="46" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/umijs/dumi">
        <img src="https://avatars2.githubusercontent.com/u/33895495?s=200&v=4" width="46" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/umijs/umi">
        <img src="https://avatars2.githubusercontent.com/u/33895495?s=200&v=4" width="46" />
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AttoJS/vue-request">
        <img src="https://raw.githubusercontent.com/AttoJS/art/master/vue-request-logo.png" width="46" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" wdith="160">
      <strong>ant-design</strong>
    </td>
    <td align="center" wdith="160">
      <strong>ant-design-vue</strong>
    </td>
    <td align="center" wdith="160">
      <strong>dumi</strong>
    </td>
    <td align="center" wdith="160">
      <strong>umi</strong>
    </td>
    <td align="center" wdith="160">
      <strong>vue-request</strong>
    </td>
  </tr>
</table>

## LICENSE

[MIT](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)
