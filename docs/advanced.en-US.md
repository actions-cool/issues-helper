---
toc: menu
---

# 🌟 Advanced

Advanced usage is not recommended to use multiple actions at the same time.

## `check-inactive`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ | v1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) for this comment | string | ✖ | v1 |
| labels | Labels filtering | string | ✖ | v1.1 |
| issue-state | State filtering | string | ✖ | v1 |
| issue-assignee | Assignee filtering | string | ✖ | v1 |
| issue-creator | Creator filtering | string | ✖ | v1 |
| issue-mentioned | Mentioned filtering | string | ✖ | v1 |
| body-includes | Body filtering | string | ✖ | v1 |
| title-includes | Title filtering | string | ✖ | v1 |
| inactive-day | Inactive days filtering | number | ✖ | v1.4 |
| inactive-label | The label name adding | string | ✖ | v1 |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-state`: The default is `all`. Optional value `open` `closed`, when these 2 items are not, both are `all`
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all
- `inactive-label`: The default is `inactive`, others can be customized. When the project does not contain the label, it will be created automatically

## `check-issue`

Check whether the issue meets the conditions according to the passed parameters and `issue-number`, and return a boolean value.

The effect of the following example is: when an issue is newly opened, verify whether the current issue designator contains `x1` or `x2`.

If one designated person is satisfied, the verification will pass, and at the same time, verify whether the title meets the conditions.

[Check rules](/en-US/guide/ref#-includes-check-rules)

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

| Param | Desc  | Type | Required | Version |
| -- | -- | -- | -- | -- |
| actions | Action type | string | ✔ | v1.2 |
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1.2 |
| issue-number | The number of issue | number | ✔ | v1.2 |
| assignee-includes | Assignees contains check | string | ✖ | v1.2 |
| title-includes | Title contains check | string | ✖ | v1.2 |
| body-includes | Body contains check | string | ✖ | v1.2 |

- `title-includes` `body-includes` supports the format `x1,x2` or `x1,x2/y1,y2`. Only supports two levels
- Return `check-result`

## `close-issues`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ | v1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) for this comment | string | ✖ | v1 |
| labels | Labels filtering | string | ✖ | v1.1 |
| issue-assignee | Assignee filtering | string | ✖ | v1 |
| issue-creator | Creator filtering | string | ✖ | v1 |
| issue-mentioned | Mentioned filtering | string | ✖ | v1 |
| body-includes | Body filtering | string | ✖ | v1 |
| title-includes | Title filtering | string | ✖ | v1 |
| inactive-day | Inactive days filtering | number | ✖ | v1.4 |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all

## `find-comments`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
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

## `lock-issues`

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
| token | [Token explain](/en-US/guide/ref#-token) | string | ✔ | v1 |
| body | When operating an issue, you can comment. Do not comment when not typing | string | ✖ | v1 |
| contents | Add [reaction](/en-US/guide/ref#-reactions-type) for this comment | string | ✖ | v1 |
| labels | Labels filtering | string | ✖ | v1.1 |
| issue-state | State filtering | string | ✖ | v1 |
| issue-assignee | Assignee filtering | string | ✖ | v1 |
| issue-creator | Creator filtering | string | ✖ | v1 |
| issue-mentioned | Mentioned filtering | string | ✖ | v1 |
| body-includes | Body filtering | string | ✖ | v1 |
| title-includes | Title filtering | string | ✖ | v1 |
| inactive-day | Inactive days filtering | number | ✖ | v1.4 |

- `labels`: When there are multiple, the query will have multiple at the same time. If not entered, all
- `issue-state`: The default is `all`. Optional value `open` `closed`, when these 2 items are not, both are `all`
- `issue-assignee`: Multiplayer is not supported. If you do not enter or enter *, all will be searched. Entering `none` will query issues for which the specified person is not added
- `inactive-day`: When entering, it will filter the issue update time earlier than the current time minus the number of inactive days. If not entered, all
