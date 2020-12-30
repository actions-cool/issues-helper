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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'add-assignees'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          assignees: 'xxx' or 'xx1,xx2'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| assignees | Designated person. No operation when no input or empty character | string | ✖ | v1.1 |

- `actions` support multiple and separated by comma. Like: `add-assignees,add-labels`
- The `name` can be modified according to the actual situation
- [Reference to on](/en-US/guide/ref#-github-docs)
- `${{ github.event.issue.number }}` is the current issue. [More references](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events)
- `assignees` support multiple and separated by comma. Pay attention to multiple settings, you need to use the version above v1.1

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'add-labels'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          labels: 'bug' or 'xx1,xx2'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| labels | New labels. When it is not filled in or is empty character, do not add | string | ✖ | v1.1 |

- `labels` support multiple and separated by comma. Pay attention to multiple settings, you need to use the version above v1.1

## `close-issue`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello @${{ github.event.issue.user.login }}. Add some comments.

            你好 @${{ github.event.issue.user.login }}。巴拉巴拉。
          contents: '+1' or '+1,heart'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| body | Add comment content | string | ✖ | v1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) | string | ✖ | v1.1 |

- `body` default is `Currently at ${owner}/${repo}. And this is default comment.`
  - Where `${owner}/${repo}` means the current repo
- Return `comment-id`, which can be used for subsequent operations. [Usage reference](/en-US/guide/ref#-outputs-use)
- `${{ github.event.issue.user.login }}` indicates the creator of the issue
- `contents` support multiple and separated by comma. Pay attention to multiple settings, you need to use the version above v1.1

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| title | The title of the new issue | string | ✖ | v1 |
| body | The body of the new issue | string | ✖ | v1 |
| labels | The labels for the new issue | string | ✖ | v1.1 |
| assignees | The assignees for the new issue | string | ✖ | v1.1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) | string | ✖ | v1.1 |

- `title` default is `Default Title`
- Return `issue-number`. [Usage reference](/en-US/guide/ref#-outputs-use)

## `delete-comment`

According to [`comment-id`](/en-US/guide/ref#-comment-id) delete the specified comment.

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| comment-id | The comment ID | number | ✔ | v1 |

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
        uses: actions-cool/issues-helper@v1
        with:
          actions: 'lock-issue'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

## `mark-duplicate`

Quickly mark duplicate questions, only for issue new comments.

```yml
name: Issue Mark Duplicate

on:
  issue_comment:
    types: [created]

jobs:
  mark-duplicate:
    runs-on: ubuntu-latest
    steps:
      - name: mark-duplicate
        uses: actions-cool/issues-helper@v1.5
        with:
          actions: 'mark-duplicate'
          token: ${{ secrets.GITHUB_TOKEN }}
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1.5 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1.5 |
| duplicate-command | Simple commands can be set, such as: `/d` | string | ✖ | v1.6 |
| duplicate-labels | Add additional labels to this issue | string | ✖ | v1.5 |
| labels | Replace the labels of the issue | string | ✖ | v1.5 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) for this comment | string | ✖ | v1.5 |
| close-issue | Whether to close the issue at the same time | string | ✖ | v1.6 |

- `duplicate-command`: When setting concise commands, while still supporting the original `Duplicate of`
- `close-issue`: Both `true` or `'true'` can take effect

<Alert>
Note: Duplicate created with the concise command does not display the content of the red box in the figure below. But in fact this has no effect.
</Alert>

![](../public/duplicate.png)

## `open-issue`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

## `remove-assignees`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| assignees | Designated person removed. When it is an empty character, do not remove | string | ✔ | v1.1 |

## `remove-labels`

Remove the specified labels.

```yml
- name: Remove labels
    uses: actions-cool/issues-helper@v1.2
    with:
      actions: 'remove-labels'
      token: ${{ secrets.GITHUB_TOKEN }}
      issue-number: ${{ github.event.issue.number }}
      labels: 'xx'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1.2 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1.2 |
| issue-number | The number of issue | number | ✔ | v1.2 |
| labels | The removed labels. When it is a blank character, do not remove | string | ✔ | v1.2 |

- `labels` supports multiple, such as `x1,x2,x3`, only the labels added by the issue will be removed

## `set-labels`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| labels | labels set. When empty characters, will remove all | string | ✔ | v1.1 |

## `unlock-issue`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| comment-id | The comment ID | number | ✔ | v1 |
| body | Update the content of comment | string | ✖ | v1 |
| update-mode | Update mode. Default `replace`, another `append` | string | ✖ | v1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) | string | ✖ | v1.1 |

- When `body` is not entered, it will remain as it is
- When `update-mode` is `append`, additional operations will be performed. Anything other than `append` will be replaced. Only effective for `body`

## `update-issue`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| issue-number | The number of issue | number | ✔ | v1 |
| state | Modify the status of issue, optional value `open` `closed` | string | ✖ | v1 |
| title | Modify the title of the issue | string | ✖ | v1 |
| body | Modify the content of issue | string | ✖ | v1 |
| update-mode |  Update mode. Default `replace`, another `append` | string | ✖ | v1 |
| labels | Replace the labels of issue | string | ✖ | v1.1 |
| assignees | Replace the assignees of issue | string | ✖ | v1.1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) | string | ✖ | v1.1 |

- `state` defaults to `open`
- When the option is not filled, it will keep the original

## `welcome`

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
        uses: actions-cool/issues-helper@v1.3
        with:
          actions: 'welcome'
          token: ${{ secrets.GITHUB_TOKEN }}
          body: hi @${{ github.event.issue.user.login }}, welcome!
          labels: 'welcome1, welcome2'
          assignees: 'xx1'
          issue-contents: '+1, -1, eyes'
```

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1.3 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1.3 |
| body | Comment on the welcome content, no comment if you leave it blank | string | ✖ | v1.3 |
| labels | Add labels to this issue | string | ✖ | v1.3 |
| assignees | Add assignees to this issue | string | ✖ | v1.3 |
| issue-contents | Add [reaction](/en-US/guide/ref#-reactions-type) to this issue| string | ✖ | v1.3 |

- If these 4 options are not filled, no operation