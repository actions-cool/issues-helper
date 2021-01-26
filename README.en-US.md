# 🤖 Issues Helper

[简体中文](./README.md) | English

[![](https://img.shields.io/github/workflow/status/actions-cool/issues-helper/ci?style=flat-square)](https://github.com/actions-cool/issues-helper/actions)
[![](https://img.shields.io/badge/marketplace-issues--helper-red?style=flat-square)](https://github.com/marketplace/actions/issues-helper)
[![dumi](https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square)](https://github.com/umijs/dumi)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![](https://img.shields.io/github/v/release/actions-cool/issues-helper?style=flat-square&color=orange)](https://github.com/actions-cool/issues-helper/releases)

[![](https://img.shields.io/github/stars/actions-cool/issues-helper?style=flat-square)](https://github.com/actions-cool/issues-helper/stargazers)
[![](https://img.shields.io/badge/discussions-on%20github-blue?style=flat-square&color=%2308979c)](https://github.com/actions-cool/issues-helper/discussions)
[![](https://img.shields.io/github/license/actions-cool/issues-helper?style=flat-square)](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)

A GitHub Action that easily helps you automatically manage issues

[Online documentation](https://actions-cool.github.io/issues-helper) | [Changelog](https://github.com/actions-cool/issues-helper/blob/main/CHANGELOG.md)

## 😎 Why use GitHub Action?

1. Complete free
2. Fully automatic
3. Hosted on the GitHub server, as long as GitHub is not down, it is not affected

> Private projects have a limit of 2000 times per month. [Specific view](https://github.com/settings/billing). Public are unlimited.

## Who is using?

Please leave a message at [**here**](https://github.com/actions-cool/issues-helper/issues/6).

<table>
<tr>
  <td align="center" width="180">
    <a href="https://github.com/ant-design/ant-design">
      <img src="https://avatars1.githubusercontent.com/u/12101536?s=200&v=4" width="46" />
      <div>ant-design</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/ant-design-blazor/ant-design-blazor">
      <img src="https://raw.githubusercontent.com/ant-design-blazor/ant-design-blazor/7dbee63648e088c73c47eada79c897bc39fc3c26/logo.svg" width="46" />
      <div>ant-design-blazor</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/vueComponent/ant-design-vue">
      <img src="https://avatars1.githubusercontent.com/u/32120805?s=200&v=4" width="46" />
      <div>ant-design-vue</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/umijs/dumi">
      <img src="https://avatars1.githubusercontent.com/u/33895495?s=200&v=4" width="46" />
      <div>dumi</div>
    </a></td>
</tr><tr>
  <td align="center" width="180">
    <a href="https://github.com/mui-org/material-ui">
      <img src="https://avatars2.githubusercontent.com/u/33663932?s=200&v=4" width="46" />
      <div>material-ui</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/ant-design/pro-components">
      <img src="https://avatars1.githubusercontent.com/u/12101536?s=200&v=4" width="46" />
      <div>pro-components</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/react-component">
      <img src="https://avatars3.githubusercontent.com/u/9441414?s=200&v=4" width="46" />
      <div>react-component</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/lijinke666/react-music-player">
      <img src="https://github.com/lijinke666/react-music-player/blob/master/assetsImg/logo.png?raw=true" width="46" />
      <div>react-music-player</div>
    </a></td>
</tr><tr>
  <td align="center" width="180">
    <a href="https://github.com/umijs/umi">
      <img src="https://avatars1.githubusercontent.com/u/33895495?s=200&v=4" width="46" />
      <div>umi</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/AttoJS/vue-request">
      <img src="https://raw.githubusercontent.com/AttoJS/art/master/vue-request-logo.png" width="46" />
      <div>vue-request</div>
    </a></td>
  <td align="center" width="180">
    <a href="https://github.com/zoo-js/zoo">
      <img src="https://avatars1.githubusercontent.com/u/70757173?s=200&v=4" width="46" />
      <div>zoo</div>
    </a></td>
  <td align="center" width="180"></td>
</tr>
</table>

## List

When the following list does not have the features you want, you can submit it in [What do you want?](https://github.com/actions-cool/issues-helper/discussions/18).

- ⭐ Base
  - [`add-assignees`](#add-assignees)
  - [`add-labels`](#add-labels)
  - [`close-issue`](#close-issue)
  - [`create-comment`](#create-comment)
  - [`create-issue`](#create-issue)
  - [`delete-comment`](#delete-comment)
  - [`lock-issue`](#lock-issue)
  - [`mark-duplicate`](#mark-duplicate)
  - [`open-issue`](#open-issue)
  - [`remove-assignees`](#remove-assignees)
  - [`remove-labels`](#remove-labels)
  - [`set-labels`](#set-labels)
  - [`unlock-issue`](#unlock-issue)
  - [`update-comment`](#update-comment)
  - [`update-issue`](#update-issue)
  - [`welcome`](#welcome)
- 🌟 Advanced
  - [`check-inactive`](#check-inactive)
  - [`check-issue`](#check-issue)
  - [`close-issues`](#close-issues)
  - [`find-comments`](#find-comments)
  - [`lock-issues`](#lock-issues)
  - [`month-statistics`](#month-statistics)
- 🌰 Example
  - [`find-comments + create-comment + update-comment`](#find-comments--create-comment--update-comment)

## 🚀 Usage

### ⭐ Base

In order to better display the function, the following is an example of the actual scene, please refer to it flexibly.

#### `add-assignees`

When an issue is added or modified, assign this issue to one or more people.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| assignees | Designated person. No operation when no input or empty character | string | ✖ |
| random-to | When set, it will be randomly selected in assignees | number | ✖ |

- `actions` support multiple and separated by comma. Like: `add-assignees,add-labels`
- The `name` can be modified according to the actual situation
- [Reference to on](#github-docs)
- `${{ github.event.issue.number }}` is the current issue. [More references](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events)
- `assignees` support multiple and separated by comma

⏫ [Back to list](#List)

#### `add-labels`

When the content of a new issue does not contain the specified format, add labels for the issue.

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
          labels: 'bug' or 'xx1,xx2'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| labels | New labels. When it is not filled in or is empty character, do not add | string | ✖ |

- `labels` support multiple and separated by comma

⏫ [Back to list](#List)

#### `close-issue`

Close the specified issue.

```yml
- name: Close issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'close-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
      body: 'This is auto closed.'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |

⏫ [Back to list](#List)

#### `create-comment`

When a designated label is added, comment on the issue.

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
            Hello @${{ github.event.issue.user.login }}. Add some comments.

            你好 @${{ github.event.issue.user.login }}。巴拉巴拉。
          contents: '+1' or '+1,heart'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| body | Add comment content | string | ✖ |
| contents | Add [reaction](#reactions-types) | string | ✖ |

- `body` default is `Currently at ${owner}/${repo}. And this is default comment.`
  - Where `${owner}/${repo}` means the current repo
- Return `comment-id`, which can be used for subsequent operations. [Usage reference](#outputs-use)
- `${{ github.event.issue.user.login }}` indicates the creator of the issue
- `contents` support multiple and separated by comma

⏫ [Back to list](#List)

#### `create-issue`

Here is an example, add an issue at UTC 00:00 on the 1st of every month.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| title | The title of the new issue | string | ✖ |
| body | The body of the new issue | string | ✖ |
| labels | The labels for the new issue | string | ✖ |
| assignees | The assignees for the new issue | string | ✖ |
| random-to | When set, it will be randomly selected in assignees | number | ✖ |
| contents | Add [reaction](#reactions-types) | string | ✖ |

- `title` default is `Default Title`
- Return `issue-number`. [Usage reference](#outputs-use)

⏫ [Back to list](#List)

#### `delete-comment`

According to [`comment-id`](#comment-id) delete the specified comment.

```yml
- name: Delete comment
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'delete-comment'
      token: ${{ secrets.GITHUB_TOKEN }}
      comment-id: xxx
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| comment-id | The comment ID | number | ✔ |

⏫ [Back to list](#List)

#### `lock-issue`

When the `invalid` label is added, the issue is locked.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |

⏫ [Back to list](#List)

#### `mark-duplicate`

Quickly mark duplicate questions, only for issue new comments or edit comments.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| duplicate-command | Simple commands can be set, such as: `/d` | string | ✖ |
| duplicate-labels | Add additional labels to this issue | string | ✖ |
| remove-labels | Set removable labels | string | ✖ |
| labels | Replace the labels of the issue | string | ✖ |
| contents | Add [reaction](#reactions-types) for this comment | string | ✖ |
| close-issue | Whether to close the issue at the same time | string | ✖ |
| require-permission | Permission required | string | ✖ |

- `duplicate-command`: When setting concise commands, while still supporting the original `Duplicate of`. Block content contains `?`
- `labels`: Highest priority
- `close-issue`: Both `true` or `'true'` can take effect
- `require-permission`: When you do not input, there is no limit. Anyone comment will trigger. Optional values are `admin`, `write`, `read`, `none`
  - If the team member sets the `read` permission, it is `read`
  - If the external Collaborator is set to `read` permission, it is `read`
  - Ordinary users have `read` permission
  - When set `write`, `admin` and `write` meet the conditions

⏫ [Back to list](#List)

#### `open-issue`

Open the specified issue.

```yml
- name: Open issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'open-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |

⏫ [Back to list](#List)

#### `remove-assignees`

Remove the person designated by issue.

```yml
- name: Remove assignees
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'remove-assignees'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      assignees: 'xx'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| assignees | Designated person removed. When it is an empty character, do not remove | string | ✔ |

⏫ [Back to list](#List)

#### `remove-labels`

Remove the specified labels.

```yml
- name: Remove labels
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'remove-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| labels | The removed labels. When it is a blank character, do not remove | string | ✔ |

- `labels` supports multiple, such as `x1,x2,x3`, only the labels added by the issue will be removed

⏫ [Back to list](#List)

#### `set-labels`

Replace the labels of issue.

```yml
- name: Set labels
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'set-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| labels | labels set. When empty characters, will remove all | string | ✔ |

⏫ [Back to list](#List)

#### `unlock-issue`

Unlock the specified issue.

```yml
- name: Unlock issue
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'unlock-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |

⏫ [Back to list](#List)

#### `update-comment`

Update the specified comment according to [`comment-id`](#comment-id).

The following example shows that 👀 is added for each new comment.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| comment-id | The comment ID | number | ✔ |
| body | Update the content of comment | string | ✖ |
| update-mode | Update mode. Default `replace`, another `append` | string | ✖ |
| contents | Add [reaction](#reactions-types) | string | ✖ |

- When `body` is not entered, it will remain as it is
- When `update-mode` is `append`, additional operations will be performed. Anything other than `append` will be replaced. Only effective for `body`

⏫ [Back to list](#List)

#### `update-issue`

Update the specified issue according to the `issue-number`.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| state | Modify the status of issue, optional value `open` `closed` | string | ✖ |
| title | Modify the title of the issue | string | ✖ |
| body | Modify the content of issue | string | ✖ |
| update-mode |  Update mode. Default `replace`, another `append` | string | ✖ |
| labels | Replace the labels of issue | string | ✖ |
| assignees | Replace the assignees of issue | string | ✖ |
| contents | Add [reaction](#reactions-types) | string | ✖ |

- `state` defaults to `open`
- When the option is not filled, it will keep the original

⏫ [Back to list](#List)

#### `welcome`

When an issue is created, the user who created the issue for the first time is welcome.

If the user is not creating for the first time, there is no operation.

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

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| body | Comment on the welcome content, no comment if you leave it blank | string | ✖ |
| labels | Add labels to this issue | string | ✖ |
| assignees | Add assignees to this issue | string | ✖ |
| issue-contents | Add [reaction](#reactions-types) to this issue| string | ✖ |

- If these 4 options are not filled, no operation

⏫ [Back to list](#List)

### 🌟 Advanced

Advanced usage is not recommended to use multiple actions at the same time.

#### `check-inactive`

At UTC 0 on the 1st of each month, add the `inactive` tag to all issues that have not been active for more than 30 days.

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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'check-inactive'
          token: ${{ secrets.GITHUB_TOKEN }}
          inactive-day: 30
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ |
| contents | Add [reaction](#reactions-types) for this comment | string | ✖ |
| labels | Labels filtering | string | ✖ |
| issue-state | State filtering | string | ✖ |
| issue-assignee | Assignee filtering | string | ✖ |
| issue-creator | Creator filtering | string | ✖ |
| issue-mentioned | Mentioned filtering | string | ✖ |
| body-includes | Body filtering | string | ✖ |
| title-includes | Title filtering | string | ✖ |
| inactive-day | Inactive days filtering | number | ✖ |
| inactive-label | The label name adding | string | ✖ |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-state`: The default is `all`. Optional value `open` `closed`, when these 2 items are not, both are `all`
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all
- `inactive-label`: The default is `inactive`, others can be customized. When the project does not contain the label, it will be created automatically

⏫ [Back to list](#List)

#### `check-issue`

Check whether the issue meets the conditions according to the passed parameters and `issue-number`, and return a boolean value.

The effect of the following example is: when an issue is newly opened, verify whether the current issue designator contains `x1` or `x2`.

If one designated person is satisfied, the verification will pass, and at the same time, verify whether the title meets the conditions.

[Check rules](#check-rules)

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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'check-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignee-includes: 'x1,x2'
          title-includes: 'x1,x2/y1,y2'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| assignee-includes | Assignees contains check | string | ✖ |
| title-includes | Title contains check | string | ✖ |
| body-includes | Body contains check | string | ✖ |

- `title-includes` `body-includes` supports the format `x1,x2` or `x1,x2/y1,y2`. Only supports two levels
- Return `check-result`, due to yml reasons, the judgment condition is `if: steps.xxid.outputs.check-result =='true'`

⏫ [Back to list](#List)

#### `close-issues`

Every 7 days at UTC 0, close the issues that have been filled with the `need info` label and have not been active for more than 7 days.

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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'close-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'need info'
          inactive-day: 7
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ |
| contents | Add [reaction](#reactions-types) for this comment | string | ✖ |
| labels | Labels filtering | string | ✖ |
| issue-assignee | Assignee filtering | string | ✖ |
| issue-creator | Creator filtering | string | ✖ |
| issue-mentioned | Mentioned filtering | string | ✖ |
| body-includes | Body filtering | string | ✖ |
| title-includes | Title filtering | string | ✖ |
| inactive-day | Inactive days filtering | number | ✖ |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all

⏫ [Back to list](#List)

#### `find-comments`

Find the current warehouse issue No. 1, the creator is k and the content contains the comment list of `this`.

```yml
- name: Find comments
    uses: actions-cool/issues-helper@v1.11
    with:
      actions: 'find-comments'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: 1
      comment-auth: 'k'
      body-includes: 'this'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| issue-number | The number of issue | number | ✔ |
| comment-auth | Comment creator, all will be queried if not filled | string | ✖ |
| body-includes | Comment content includes filtering, no verification if not filled | string | ✖ |
| direction | Return `comments` sort | string | ✖ |

- Return `comments` in the following format:

```js
[
  {id: 1, auth: 'x', body: 'xxx', created: '', updated: ''},
  {id: 2, auth: 'x', body: 'xxx', created: '', updated: ''},
]
```

- `direction` defaults to ascending order, only when `desc` is set, descending order will be returned
- The `created` `updated` in the returned array, determined by the environment, will be UTC +0

⏫ [Back to list](#List)

#### `lock-issues`

Every 3 months at UTC 0 on the 1st, lock all issues that have been filled with the `inactive` label and have not been active for more than 128 days.

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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'lock-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'inactive'
          inactive-day: 128
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ |
| contents | Add [reaction](#reactions-types) for this comment | string | ✖ |
| labels | Labels filtering | string | ✖ |
| issue-state | State filtering | string | ✖ |
| issue-assignee | Assignee filtering | string | ✖ |
| issue-creator | Creator filtering | string | ✖ |
| issue-mentioned | Mentioned filtering | string | ✖ |
| body-includes | Body filtering | string | ✖ |
| title-includes | Title filtering | string | ✖ |
| inactive-day | Inactive days filtering | number | ✖ |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-state`: The default is `all`. Optional value `open` `closed`, when these 2 items are not, both are `all`
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all

⏫ [Back to list](#List)

#### `month-statistics`

At 1 o'clock on the 1st of each month, an issue is generated for the statistics of the previous month.

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
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'month-statistics'
          token: ${{ secrets.GITHUB_TOKEN }}
          count-lables: 'true'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](#token) | string | ✔ |
| labels | The labels for the new issue | string | ✖ |
| assignees | The assignees for the new issue | string | ✖ |
| count-lables | Whether the new issue count labels | string | ✖ |
| count-comments | Whether the new issue count comments | string | ✖ |

- The new issue title defaults to `[Current repo] Month Statistics: Year-Month`
- `count-lables`: You can set `'true'` to add labels statistics
- `count-comments`: You can set `'true'` to add comments statistics

⏫ [Back to list](#List)

## 🌰 Example

Flexible reference.

### `find-comments + create-comment + update-comment`

Hypothetical scenario: When the issue modification of the `watch` label is added, find out whether there is a comment containing `error` created by k, if there is only one, update the comment, if not, add a new comment.

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
        uses: actions-cool/issues-helper@v1.11
        id: fcid
        with:
          actions: 'find-comments'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          comment-auth: k
          body-includes: 'error'

      - name: create comment
        if: ${{ steps.fcid.outputs.comments.length == 0 }}
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: 'Some error!'

      - name: update comment
        if: ${{ steps.fcid.outputs.comments.length == 1 }}
        uses: actions-cool/issues-helper@v1.11
        with:
          actions: 'update-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          comment-id: ${{ steps.fcid.outputs.comments[0].id }}
          body: 'Some error again!'
          update-mode: 'append'
```

⏫ [Back to list](#List)

## 🎁 Reference

### token

Need to have the person token with push permission.

- [Personal token application](https://github.com/settings/tokens)
  - Need to check `Full control of private repositories`
- Project add secrets
  - Select settings, select secrets, select `New repository secret`
  - `Name` is the same as in actions
  - `Value` fill in the token just applied by the individual

When the token is not filled in actions or the corresponding secrets are not added to the project, it will default to github-actions <kbd>bot</kbd>. [More](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow).

⏫ [Back to list](#List)

### `outputs` use

```yml
- name: Create issue
  uses: actions-cool/issues-helper@v1.11
  id: createissue
  with:
    actions: 'create-issue'
    token: ${{ secrets.GITHUB_TOKEN }}
- name: Check outputs
  run: echo "Outputs issue_number is ${{ steps.createissue.outputs.issue-number }}"
```

[More](https://docs.github.com/en/free-pro-team@latest/actions/creating-actions/metadata-syntax-for-github-actions#outputs).

### GitHub Docs

- [Workflow syntax for GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on)
- [Events that trigger workflows](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)

⏫ [Back to list](#List)

### Check rules

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

⏫ [Back to list](#List)
### Reactions types

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

⏫ [Back to list](#List)

### `comment-id`

Click the `···` icon in the upper right corner of a comment, select `Copy link`, and the number at the end of the url is `comment_id`.

⏫ [Back to list](#List)

## ✨ Version

- Version rules
  - Use two-level semantic version, such as v1, v1.1, v2, v2.1
  - v1 represents the initial version
  - The fixes and additions to the v1 version will be released to the v1.1 version
  - When the released v1.x runs stable for a certain period of time or undergoes refactoring, release the advanced v2 version

- Version selection
  - It is recommended to use the latest releases version. It can be seen in [releases](https://github.com/actions-cool/issues-helper/releases)
  - You can also refer to the update log below to select the version
  - The latest v1.x release code will be merged into the 1.x branch
  - It also supports the direct use of branch versions. Such as:

```yml
- name: Issues Helper
  uses: actions-cool/issues-helper@main

# or

- name: Issues Helper
  uses: actions-cool/issues-helper@1.x
```

## Actions Template

- You can directly use this [GitHub Actions workflow template](https://github.com/actions-cool/.github) repositorie template
- Personal exercises and tests [Actions](https://github.com/xrkffgg/test-ci) repository
- Can also refer to the warehouse of [online users](#who-is-using)

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/issues-helper/issues)
- Discuss via [Discussions](https://github.com/actions-cool/issues-helper/discussions)
- Submit [Pull Request](https://github.com/actions-cool/issues-helper/pulls) to improve the code of `issues-helper`

## LICENSE

[MIT](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)
