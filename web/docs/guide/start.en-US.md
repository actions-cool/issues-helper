## Quick start

### 1. New Action

Click Actions in the warehouse, if Actions have been added, the following interface will be displayed.

![](https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*D5dMQLk2pI0AAAAAAAAAAAAAARQnAQ)

Click `New workflow` to add.

![](https://gw.alipayobjects.com/mdn/rms_f97235/afts/img/A*cClPRIW6HKcAAAAAAAAAAAAAARQnAQ)

<Alert type="success">
You can click <Badge>set up a workflow yourself</Badge> to add a custom action, or you can apply a new action based on a template. <a target="_blank" href="https://github.com/actions-cool/.github">Templates</a>.
</Alert>

### 2. Edit Action

Actions storage address is fixed, unified as `/.github/workflows/xx.yml`.

Let's take the example of the home page and explain it in detail. The corresponding scenario is: when an issue adds the `help wanted` tag, the system will automatically comment.

```yml
name: Issue Reply

on:
  issues:
    types: [labeled]

jobs:
  reply-helper:
    runs-on: ubuntu-latest
    steps:
      - name: help wanted
        if: github.event.label.name == 'help wanted'
        uses: actions-cool/issues-helper@v3
        with:
          actions: 'create-comment'
          token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
          body: |
            Hello @${{ github.event.issue.user.login }}. We totally like your proposal/feedback, welcome PR。

            你好 @${{ github.event.issue.user.login }}，我们完全同意你的提议/反馈，欢迎PR。
```
- `YML` syntax reference
  - [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#about-yaml-syntax-for-workflows)
- `name`: The workflow name
  - Actions workflow name, can be customized according to actual situation
- `on`: The action trigger condition
  - Reference [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)
- `uses`: Use actions name
  - `uses: actions-cool/issues-helper@v2.0.0`。Please [refer](/en-US/changelog) to version selection
- `issues-hepler` parameter
  - `actions`: The name of the function used, **required**. Support multiple, separated by commas, such as `create-comment,close-issue` means comment and close issue
  - `token`: A person who needs to have push permission token
    - [More view](/en-US/guide/ref#-token)
  - `issue-number`: Incoming parameter, here means the number of the current issue. If you are confused about the writing, you can [view](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context)
  - `body`: Incoming parameters, here means the content of the current comment

### 3. Enable Action

When you finish writing and submit to the master branch, you can automatically enable the workflow, and the trigger conditions follow the definition of `on`.

😏 I believe that you have a general understanding of `how to use`, do you want to try it quickly?

Please check the functions you need in [Basic](/en-US/base) and [Advanced](/en-US/advanced) for flexible reference.
