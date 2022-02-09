---
toc: menu
---

# ⭐ Base

In order to better display the function, the following is an example of the actual scene, please refer to it flexibly.

## `add-assignees`

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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'add-assignees'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignees: 'xxx' or 'xx1,xx2'
          random-to: 1
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| assignees | Designated person. No operation when no input or empty character | string | ✖ |
| random-to | When set, it will be randomly selected in assignees | number | ✖ |

- `actions` support multiple and separated by comma. Like: `add-assignees,add-labels`
- The `name` can be modified according to the actual situation
- [Reference to on](/en-US/guide/ref#-github-docs)
- `${{ github.event.issue.number }}` is the current issue. [More references](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events)
- `assignees` support multiple and separated by comma
- You can assign up to 10 people to each issue

## `add-labels`

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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'add-labels'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          labels: 'bug' or 'xx1,xx2'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| labels | New labels. When it is not filled in or is empty character, do not add | string | ✖ |

- `labels` support multiple and separated by comma

## `close-issue`

Close the specified issue.

```yml
- name: Close issue
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'close-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |

## `create-comment`

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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello @${{ github.event.issue.user.login }}. Add some comments.

            你好 @${{ github.event.issue.user.login }}。巴拉巴拉。
          emoji: '+1' or '+1,heart'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| body | Add comment content | string | ✖ |
| emoji | Add [emoji](/en-US/guide/ref#-emoji-type) | string | ✖ |

- No action when `body` is empty
- Return `comment-id`, which can be used for subsequent operations. [Usage reference](/en-US/guide/ref#-outputs-use)
- `${{ github.event.issue.user.login }}` indicates the creator of the issue
- `emoji` support multiple and separated by comma

## `create-issue`

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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'create-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          title: 'xxxx'
          body: 'xxxx'
          labels: 'xx'
          assignees: 'xxx'
          emoji: '+1'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| title | The title of the new issue | string | ✖ |
| body | The body of the new issue | string | ✖ |
| labels | The labels for the new issue | string | ✖ |
| assignees | The assignees for the new issue | string | ✖ |
| random-to | When set, it will be randomly selected in assignees | number | ✖ |
| emoji | Add [emoji](/en-US/guide/ref#-emoji-type) | string | ✖ |

- `title` default is `Default Title`
- Return `issue-number`. [Usage reference](/en-US/guide/ref#-outputs-use)

## `create-label`

Create label. If you want to maintain labels in batches, [see](https://github.com/actions-cool/labels-helper).

```yml
- name: Create label
  uses: actions-cool/issues-helper@v3
  with:
    actions: 'create-label'
    token: ${{ secrets.GITHUB_TOKEN }}
    label-name: 'xx'
    label-color: '0095b3'
    label-desc: 'xx'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| label-name | Label name, emoji support | string | ✔ |
| label-color | Label color, the format is hexadecimal color code, without `#` | string | ✖ |
| label-desc | Label description | string | ✖ |

- `label-name`: If it already exists, no operation
- `label-color`: Default is `ededed`

## `delete-comment`

According to [`comment-id`](/en-US/guide/ref#-comment-id) delete the specified comment.

```yml
- name: Delete comment
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'delete-comment'
      token: ${{ secrets.GITHUB_TOKEN }}
      comment-id: xxx
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| comment-id | The comment ID | number | ✔ |

## `lock-issue`

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
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'lock-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| lock-reason | Reason for locking issue | string | ✖ |

- `lock-reason`: Optional values are `off-topic` `too heated` `resolved` `spam`

## `open-issue`

Open the specified issue.

```yml
- name: Open issue
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'open-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: xxx
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |

## `remove-assignees`

Remove the person designated by issue.

```yml
- name: Remove assignees
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'remove-assignees'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      assignees: 'xx'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| assignees | Designated person removed. When it is an empty character, do not remove | string | ✔ |

## `remove-labels`

Remove the specified labels.

```yml
- name: Remove labels
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'remove-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| labels | The removed labels. When it is a blank character, do not remove | string | ✔ |

- `labels` supports multiple, such as `x1,x2,x3`, only the labels added by the issue will be removed

## `set-labels`

Replace the labels of issue.

```yml
- name: Set labels
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'set-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| labels | labels set. When empty characters, will remove all | string | ✔ |

## `unlock-issue`

Unlock the specified issue.

```yml
- name: Unlock issue
    uses: actions-cool/issues-helper@v3
    with:
      actions: 'unlock-issue'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |

## `update-comment`

Update the specified comment according to [`comment-id`](/en-US/guide/ref#-comment-id).

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
          uses: actions-cool/issues-helper@v3
          with:
            actions: 'update-comment'
            token: ${{ secrets.GITHUB_TOKEN }}
            comment-id: ${{ github.event.comment.id }}
            emoji: 'eyes'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| comment-id | The comment ID | number | ✔ |
| out-comments | The output of `find-comments`, if you find multiple, operate multiple | string | ✖ |
| body | Update the content of comment | string | ✖ |
| update-mode | Update mode. Default `replace`, another `append` | string | ✖ |
| emoji | Add [emoji](/en-US/guide/ref#-emoji-type) | string | ✖ |

- When `body` is not entered, it will remain as it is
- When `update-mode` is `append`, additional operations will be performed. Anything other than `append` will be replaced. Only effective for `body`
- When `out-comments` is entered, `comment-id` does not work

## `update-issue`

Update the specified issue according to the `issue-number`.

```yml
- name: Update issue
    uses: actions-cool/issues-helper@v3
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
      emoji: '+1'
```

| Param | Desc | Type | Required |
| -- | -- | -- | -- |
| actions | Action type | string | ✔ |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✖ |
| issue-number | The number of issue. When not input, it will be obtained from the trigger event | number | ✖ |
| state | Modify the status of issue, optional value `open` `closed` | string | ✖ |
| title | Modify the title of the issue | string | ✖ |
| body | Modify the content of issue | string | ✖ |
| update-mode |  Update mode. Default `replace`, another `append` | string | ✖ |
| labels | Replace the labels of issue | string | ✖ |
| assignees | Replace the assignees of issue | string | ✖ |
| emoji | Add [emoji](/en-US/guide/ref#-emoji-type) | string | ✖ |

- `state` defaults to `open`
- When the option is not filled, it will keep the original
