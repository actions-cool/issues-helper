# 类使用说明（中文）

这个库对外主要导出两个可直接使用的类：

- `IssueCoreEngine`：底层 Issue API 封装，适合在脚本里直接调用。
- `IssueHelperEngine`：基于 GitHub Action 输入参数的高层动作执行器。

## 安装

```bash
npm i issues-helper
```

## 导入

```ts
import { IssueCoreEngine, IssueHelperEngine } from 'issues-helper';
```

## 1. `IssueCoreEngine`

当你希望在自己的 Node.js 脚本中直接调用 Issue 接口时，使用这个类。

### 构造函数

```ts
new IssueCoreEngine({
  owner: 'your-org',
  repo: 'your-repo',
  issueNumber: 123,
  token: process.env.GITHUB_TOKEN!,
});
```

### 基础示例

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
  await ice.createComment('感谢反馈，我们会尽快处理。');

  const issue = await ice.getIssue();
  console.log(issue.title, issue.state);
}

run().catch(console.error);
```

### 常用方法

- Issue 状态: `openIssue`, `closeIssue`, `lockIssue`, `unlockIssue`
- 标签/指派: `addLabels`, `removeLabels`, `setLabels`, `addAssignees`, `removeAssignees`
- 内容操作: `createComment`, `updateComment`, `deleteComment`, `updateIssue`, `createIssue`
- 查询能力: `getIssue`, `listComments`, `listIssues`, `getUserPermission`

## 2. `IssueHelperEngine`

当你在 GitHub Action 运行环境中，希望按内置 `TAction` 动作执行逻辑时，使用这个类。

### 重要说明

`IssueHelperEngine` 会读取 GitHub Action 输入参数（例如 `token`、`labels`、`assignees`、`body`、`title`、`issue-number` 等）。
因此它依赖 `@actions/core` 的输入上下文，主要用于 GitHub Actions 场景。

### 基础示例（GitHub Action 环境）

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

### `doExeAction` 支持的动作

```txt
add-assignees, add-labels, close-issue, create-comment, create-issue,
create-label, delete-comment, lock-issue, open-issue, remove-assignees,
remove-labels, set-labels, unlock-issue, update-comment, update-issue,
check-inactive, check-issue, close-issues, find-comments, find-issues,
get-issue, lock-issues, mark-assignees, mark-duplicate, toggle-labels, welcome
```

## 如何选择

- 需要在脚本里精细控制 API 调用: 用 `IssueCoreEngine`
- 需要在 GitHub Action 里按动作配置执行: 用 `IssueHelperEngine`
