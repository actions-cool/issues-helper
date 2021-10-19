const core = require('@actions/core');
const github = require('@actions/github');
const { THANKS } = require('actions-util/lib/thanks');

// **************************************************************************
const {
  doAddAssignees,
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doCreateIssue,
  doCreateLabel,
  doDeleteComment,
  doMarkDuplicate,
  doLockIssue,
  doOpenIssue,
  doRemoveAssignees,
  doRemoveLabels,
  doSetLabels,
  doUnlockIssue,
  doUpdateComment,
  doUpdateIssue,
  doWelcome,
} = require('./base.js');

const {
  doCheckInactive,
  doCheckIssue,
  doCloseIssues,
  doFindComments,
  doLockIssues,
  doMonthStatistics,
} = require('./advanced.js');

// **************************************************************************
const ALLACTIONS = [
  // base
  'add-assignees',
  'add-labels',
  'close-issue',
  'create-comment',
  'create-issue',
  'create-label',
  'delete-comment',
  'lock-issue',
  'mark-duplicate',
  'open-issue',
  'remove-assignees',
  'remove-labels',
  'set-labels',
  'unlock-issue',
  'update-comment',
  'update-issue',
  'welcome',

  // advanced
  'check-inactive',
  'check-issue',
  'close-issues',
  'find-comments',
  'lock-issues',
  'month-statistics',
];

// **************************************************************************
async function main() {
  try {
    const ctx = github.context;

    // No display to outside
    let owner, repo;
    if (core.getInput('repo')) {
      owner = core.getInput('repo').split('/')[0];
      repo = core.getInput('repo').split('/')[1];
    } else {
      owner = ctx.repo.owner;
      repo = ctx.repo.repo;
    }

    let defaultNo;
    if (ctx.eventName === 'issues' || ctx.eventName === 'issue_comment') {
      defaultNo = ctx.payload.issue.number;
    }

    const issueNumber = core.getInput('issue-number') || defaultNo;
    const commentId = core.getInput('comment-id');

    const defaultBody = `Currently at ${owner}/${repo}. And this is default comment.`;
    const body = core.getInput('body') || defaultBody;

    const defaultTitle = `Default Title`;
    const title = core.getInput('title') || defaultTitle;

    const assignees = core.getInput('assignees');

    const labels = core.getInput('labels');
    const state = core.getInput('state') || 'open';

    let updateMode = core.getInput('update-mode');
    if (updateMode !== 'append') {
      updateMode = 'replace';
    }

    // actions
    const actions = core.getInput('actions', { required: true });

    const actionsArr = actions.split(',');
    for (const action of actionsArr) {
      await testActions(action.trim());
    }

    async function testActions(action) {
      if (ALLACTIONS.includes(action)) {
        await choseActions(action);
      } else {
        core.setFailed(`Actions: [${action}] is not supported!`);
      }
    }

    async function choseActions(action) {
      switch (action) {
        // base
        case 'add-assignees':
          await doAddAssignees(owner, repo, issueNumber, assignees);
          break;
        case 'add-labels':
          await doAddLabels(owner, repo, issueNumber, labels);
          break;
        case 'close-issue':
          await doCloseIssue(owner, repo, issueNumber);
          break;
        case 'create-comment':
          await doCreateComment(owner, repo, issueNumber, body);
          break;
        case 'create-issue':
          await doCreateIssue(owner, repo, title, body, labels, assignees);
          break;
        case 'create-label':
          await doCreateLabel(owner, repo);
          break;
        case 'delete-comment':
          await doDeleteComment(owner, repo, commentId);
          break;
        case 'lock-issue':
          await doLockIssue(owner, repo, issueNumber);
          break;
        case 'mark-duplicate':
          await doMarkDuplicate(owner, repo, labels);
          break;
        case 'open-issue':
          await doOpenIssue(owner, repo, issueNumber);
          break;
        case 'remove-assignees':
          await doRemoveAssignees(owner, repo, issueNumber, assignees);
          break;
        case 'remove-labels':
          await doRemoveLabels(owner, repo, issueNumber, labels);
          break;
        case 'set-labels':
          await doSetLabels(owner, repo, issueNumber, labels);
          break;
        case 'unlock-issue':
          await doUnlockIssue(owner, repo, issueNumber);
          break;
        case 'update-comment':
          await doUpdateComment(owner, repo, commentId, body, updateMode);
          break;
        case 'update-issue':
          await doUpdateIssue(
            owner,
            repo,
            issueNumber,
            state,
            title,
            body,
            updateMode,
            assignees,
            labels,
          );
          break;
        case 'welcome':
          await doWelcome(owner, repo, assignees, labels, body);
          break;

        // advanced
        case 'check-inactive':
          await doCheckInactive(owner, repo, labels);
          break;
        case 'check-issue':
          await doCheckIssue(owner, repo, issueNumber);
          break;
        case 'close-issues':
          await doCloseIssues(owner, repo, labels);
          break;
        case 'find-comments':
          await doFindComments(owner, repo, issueNumber);
          break;
        case 'lock-issues':
          await doLockIssues(owner, repo, labels);
          break;
        case 'month-statistics':
          await doMonthStatistics(owner, repo, labels, assignees);
          break;
        // default
        default:
          break;
      }
    }

    core.info(THANKS);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// **************************************************************************
main();
