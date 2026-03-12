# Class Usage (English)

This package exports two main classes for programmatic use:

- `IssueCoreEngine`: low-level GitHub Issue API wrapper.
- `IssueHelperEngine`: high-level action dispatcher driven by GitHub Action inputs.

## Installation

```bash
npm i issues-helper
```

## Exports

```ts
import { IssueCoreEngine, IssueHelperEngine } from 'issues-helper';
```

## 1. `IssueCoreEngine`

Use this class when you want to call issue APIs directly in your own script.

### Constructor

```ts
new IssueCoreEngine({
  owner: 'your-org',
  repo: 'your-repo',
  issueNumber: 123,
  token: process.env.GITHUB_TOKEN!,
});
```

### Basic Example

```ts
import { IssueCoreEngine } from 'issues-helper';

async function run() {
  const ice = new IssueCoreEngine({
    owner: 'your-org',
    repo: 'your-repo',
    issueNumber: 123,
    token: process.env.GITHUB_TOKEN!,
  });

  await ice.addLabels(['bug', 'triage']);
  await ice.createComment('Thanks for your report. We are checking this.');

  const issue = await ice.getIssue();
  console.log(issue.title, issue.state);
}

run().catch(console.error);
```

### Common Methods

- Issue status: `openIssue`, `closeIssue`, `lockIssue`, `unlockIssue`
- Labels/assignees: `addLabels`, `removeLabels`, `setLabels`, `addAssignees`, `removeAssignees`
- Content: `createComment`, `updateComment`, `deleteComment`, `updateIssue`, `createIssue`
- Query: `getIssue`, `listComments`, `listIssues`, `getUserPermission`

## 2. `IssueHelperEngine`

Use this class when you are inside a GitHub Action and want to execute one of the built-in `TAction` actions.

### Important

`IssueHelperEngine` reads parameters from GitHub Action inputs (for example `token`, `labels`, `assignees`, `body`, `title`, `issue-number`, etc.).
It is designed for GitHub Actions runtime and depends on `@actions/core` input context.

### Basic Example (GitHub Action runtime)

```ts
import * as github from '@actions/github';
import { IssueHelperEngine, type TAction } from 'issues-helper';

async function run() {
  const helper = new IssueHelperEngine(github.context);

  await helper.doExeAction('create-comment' as TAction);
  await helper.doExeAction('add-labels' as TAction);
}

run().catch(console.error);
```

### Supported `doExeAction` values

```txt
add-assignees, add-labels, close-issue, create-comment, create-issue,
create-label, delete-comment, lock-issue, open-issue, remove-assignees,
remove-labels, set-labels, unlock-issue, update-comment, update-issue,
check-inactive, check-issue, close-issues, find-comments, find-issues,
get-issue, lock-issues, mark-assignees, mark-duplicate, toggle-labels, welcome
```

## Which Class Should I Use?

- Choose `IssueCoreEngine` when you need direct and explicit API calls in Node.js scripts.
- Choose `IssueHelperEngine` when you are implementing GitHub Action workflows and want action-style behavior based on inputs.
