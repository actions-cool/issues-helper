---
toc: menu
---

<Alert type="success">
Here are some things I summarized in my use, I hope it can help you.
</Alert>

## Include judgment in `yml`

```yml
if: contains(github.event.issue.body, 'ie') == false
```
- Triggered when the issue body does not contain `ie`
- The js `includes()` syntax is not supported in the yml
- Case is not checked, `IE` and also similar to `kiekk` can also be satisfied

[More](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#functions).

## Pass value and output in `yml`

```
with:
  actions: 'month-statistics'
  token: ${{ secrets.GITHUB_TOKEN }}
  count-lables: 'true'
```

- `count-lables`: Regardless of setting `true` or `'ture'`, all received in the program is in string format

At the same time, the output is also in string format. [See](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idoutputs).

- `check-result`: The judgment condition is `if: steps.xxid.outputs.check-result =='true'`

## `GitHub Actions bot` trigger

When an action is set, such as adding a label `x1` to an issue, Actions will automatically add a label `x2` to the issue.

But if this is done by `GitHub Actions bot` (that is, the token in the actions is not passed, or the default `token: ${{ secrets.GITHUB_TOKEN }}` is used), the actions of label `x2` will not be triggered.

ref: [GitHub docs](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#triggering-new-workflows-using-a-personal-access-token)

## `assignees` scope

- The owner or collaborator of the warehouse, if there is an organization, including members
- Participants of the issue, including creators and commenters
- Max 10

## Benchmark

For example: I use a Tag to trigger an Action, and the code that triggers the benchmark will follow the Action definition of the code corresponding to this Tag instead of the main branch code.
