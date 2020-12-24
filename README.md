# 🤖 Issues Helper

English | [简体中文](./README.zh-CN.md)

[![](https://img.shields.io/github/workflow/status/actions-cool/issues-helper/ci?style=flat-square)](https://github.com/actions-cool/issues-helper/actions) [![](https://img.shields.io/badge/marketplace-issues--helper-red?style=flat-square)](https://github.com/marketplace/actions/issues-helper) [![](https://img.shields.io/github/stars/actions-cool/issues-helper?style=flat-square)](https://github.com/actions-cool/issues-helper/stargazers) [![](https://img.shields.io/github/v/release/actions-cool/issues-helper?style=flat-square&color=orange)](https://github.com/actions-cool/issues-helper/releases) [![](https://img.shields.io/badge/discussions-on%20github-blue?style=flat-square&color=%2308979c)](https://github.com/actions-cool/issues-helper/discussions) [![](https://img.shields.io/github/license/actions-cool/issues-helper?style=flat-square)](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)

A GitHub Action to help you manage issues

## 😎 Why use GitHub Action?

1. Complete free.
2. Fully automatic.
3. Hosted on the GitHub server, as long as GitHub is not down, it will keep running.

> Private projects have a limit of 2000 times per month, [Specific view](https://github.com/settings/billing). Public are unlimited.

## List

- ⭐ Base
  - [`add-assignees`](#add-assignees)
  - [`add-labels`](#add-labels)
  - [`close-issue`](#close-issue)
  - [`create-comment`](#create-comment)
  - [`create-issue`](#create-issue)
  - [`delete-comment`](#delete-comment)
  - [`lock-issue`](#lock-issue)
  - [`open-issue`](#open-issue)
  - [`remove-assignees`](#remove-assignees)
  - [`set-labels`](#set-labels)
  - [`unlock-issue`](#unlock-issue)
  - [`update-comment`](#update-comment)
  - [`update-issue`](#update-issue)
- ⭐ Advanced
  - [`check-inactive`](#check-inactive)
  - [`close-issues`](#close-issues)
  - [`find-comments`](#find-comments)
  - [`lock-issues`](#lock-issues)
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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'add-assignees'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignees: 'xxx' or ['xxx'] or ['xx1', 'xx2']
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| assignees | Designated person. No operation when no input or empty character or empty array | string \| string\[] | ✖ | v1 |

- `actions` support multiple and separated by comma. Like: `add-assignees,add-labels`
- The `name` can be modified according to the actual situation
- [on reference](#github-docs)
- `${{ github.event.issue.number }}` is the current issue. [More references](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events)

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'add-labels'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          labels: 'bug' or ['bug'] or ['bug1', 'bug2']
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| labels | New labels. When it is not filled in or is empty character, empty array, do not add | string \| string\[] | ✖ | v1 |

⏫ [Back to list](#List)

#### `close-issue`

Close the specified issue.

```yml
- name: Close issue
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'close-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
      body: 'This is auto closed.'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello @${{ github.event.issue.user.login }}. Add some comments.

            你好 @${{ github.event.issue.user.login }}。巴拉巴拉。
          contents: '+1' or ['+1', 'heart']
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| body | Add comment content | string | ✖ | v1 |
| contents | Add [reaction](#reactions-types) | string \| string\[] | ✖ | v1 |

- `body` default is `Currently at ${owner}/${repo}. And this is default comment.`
  - Where `${owner}/${repo}` means the current repo
- Return `comment-id`, which can be used for subsequent operations. [Usage reference](#outputs-use)
- `${{ github.event.issue.user.login }}` indicates the creator of the issue

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

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| title | The title of the new issue | string | ✖ | v1 |
| body | The body of the new issue | string | ✖ | v1 |
| labels | The labels for the new issue | string \| string\[] | ✖ | v1 |
| assignees | The assignees for the new issue | string \| string\[] | ✖ | v1 |
| contents | Add [reaction](#reactions-types) | string \| string\[] | ✖ | v1 |

- `title` default is `Default Title`
- Return `issue-number`. [Usage reference](#outputs-use)

⏫ [Back to list](#List)

#### `delete-comment`

According to [`comment-id`](#comment-id) delete the specified comment.

```yml
- name: Delete comment
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'delete-comment'
      token: ${{ secrets.GITHUB_TOKEN }}
      comment-id: xxx
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| comment-id | The comment ID | number | ✔ | v1 |

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'lock-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

⏫ [Back to list](#List)

#### `open-issue`

Open the specified issue.

```yml
- name: Open issue
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'open-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

⏫ [Back to list](#List)

#### `remove-assignees`

Remove the person designated by issue.

```yml
- name: Remove assignees
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'remove-assignees'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      assignees: 'xx'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| assignees | Designated person removed. When it is an empty character, empty array, do not remove | string \| string\[] | ✔ | v1 |

⏫ [Back to list](#List)

#### `set-labels`

Replace the labels of issue.

```yml
- name: Set labels
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'set-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| labels | labels set. When empty characters, empty array, will remove all | string \| string\[] | ✔ | v1 |

⏫ [Back to list](#List)

#### `unlock-issue`

Unlock the specified issue.

```yml
- name: Unlock issue
    uses: actions-cool/issues-helper@v1
    with:
      actions: 'unlock-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

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
          uses: actions-cool/issues-helper@v1
          with:
            actions: 'update-comment'
            token: ${{ secrets.GITHUB_TOKEN }}
            comment-id: ${{ github.event.comment.id }}
            contents: 'eyes'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| comment-id | The comment ID | number | ✔ | v1 |
| body | Update the content of comment | string | ✖ | v1 |
| update-mode | Update mode. Default `replace`, another `append` | string | ✖ | v1 |
| contents | Add [reaction](#reactions-types) | string \| string\[] | ✖ | v1 |

- When `body` is not entered, it will remain as it is
- When `update-mode` is `append`, additional operations will be performed. Anything other than `append` will be replaced. Only effective for `body`

⏫ [Back to list](#List)

#### `update-issue`

Update the specified issue according to the `issue-number`.

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

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| state | Modify the status of issue, optional value `open` `closed` | string | ✖ | v1 |
| title | Modify the title of the issue | string | ✖ | v1 |
| body | Modify the content of issue | string | ✖ | v1 |
| update-mode |  Update mode. Default `replace`, another `append` | string | ✖ | v1 |
| labels | Replace the labels of issue | string \| string\[] | ✖ | v1 |
| assignees | Replace the assignees of issue | string \| string\[] | ✖ | v1 |
| contents | Add [reaction](#reactions-types) | string \| string\[] | ✖ | v1 |

- `state` defaults to `open`
- When the option is not filled, it will keep the original

⏫ [Back to list](#List)

### ⭐ Advanced

It is not recommended to use multiple actions for advanced usage.

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'check-inactive'
          token: ${{ secrets.GITHUB_TOKEN }}
          inactive-day: 30
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ | v1 |
| labels | Labels filtering | string \| string\[] | ✖ | v1 |
| issue-state | State filtering | string | ✖ | v1 |
| issue-assignee | Assignee filtering | string | ✖ | v1 |
| issue-creator | Creator filtering | string | ✖ | v1 |
| issue-mentioned | Mentioned filtering | string | ✖ | v1 |
| body-includes | Body filtering | string | ✖ | v1 |
| title-includes | Title filtering | string | ✖ | v1 |
| inactive-day | Inactive days filtering | number | ✖ | v1 |
| inactive-label | The label name adding | string | ✖ | v1 |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-state`: The default is `all`. Optional value `open` `closed`, when these 2 items are not, both are `all`
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all
- `inactive-label`: The default is `inactive`, others can be customized. When the project does not contain the label, it will be created automatically

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'close-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'need info'
          inactive-day: 7
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ | v1 |
| labels | Labels filtering | string \| string\[] | ✖ | v1 |
| issue-assignee | Assignee filtering | string | ✖ | v1 |
| issue-creator | Creator filtering | string | ✖ | v1 |
| issue-mentioned | Mentioned filtering | string | ✖ | v1 |
| body-includes | Body filtering | string | ✖ | v1 |
| title-includes | Title filtering | string | ✖ | v1 |
| inactive-day | Inactive days filtering | number | ✖ | v1 |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all

⏫ [Back to list](#List)

#### `find-comments`

Find the current warehouse issue No. 1, the creator is k and the content contains the comment list of `this`.

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

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| comment-auth | Comment creator, all will be queried if not filled | string | ✖ | v1 |
| body-includes | Comment content includes filtering, no verification if not filled | string | ✖ | v1 |
| direction | Return `comments` sort | string | ✖ | v1 |

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'lock-issues'
          token: ${{ secrets.GITHUB_TOKEN }}
          labels: 'inactive'
          inactive-day: 128
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](#token) | string | ✔ | v1 |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ | v1 |
| labels | Labels filtering | string \| string\[] | ✖ | v1 |
| issue-state | State filtering | string | ✖ | v1 |
| issue-assignee | Assignee filtering | string | ✖ | v1 |
| issue-creator | Creator filtering | string | ✖ | v1 |
| issue-mentioned | Mentioned filtering | string | ✖ | v1 |
| body-includes | Body filtering | string | ✖ | v1 |
| title-includes | Title filtering | string | ✖ | v1 |
| inactive-day | Inactive days filtering | number | ✖ | v1 |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-state`: The default is `all`. Optional value `open` `closed`, when these 2 items are not, both are `all`
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all

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

When the token is not filled in actions or the corresponding secrets are not added to the project, it will default to github-actions <kbd>bot</kbd>.

⏫ [Back to list](#List)

### `outputs` use

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

### GitHub Docs

- [Workflow syntax for GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#on)
- [Events that trigger workflows](https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows)

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

## Actions Template

[GitHub Actions workflow template](https://github.com/actions-cool/.github). After fork, you can use the template directly.

## 💖 Who are using?

You can come to the following reference template. Please leave a message at [**here** ](https://github.com/actions-cool/issues-helper/issues/6).

## LICENSE

[MIT](https://github.com/actions-cool/issues-helper/blob/main/LICENSE)
