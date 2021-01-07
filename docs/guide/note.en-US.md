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

## `GitHub Actions bot` trigger

When an action is set, such as adding a label `x1` to an issue, Actions will automatically add a label `x2` to the issue.

But if this is done by `GitHub Actions bot` (that is, the token in the actions is not passed, or the default `token: ${{ secrets.GITHUB_TOKEN }}` is used), the actions of label `x2` will not be triggered.
