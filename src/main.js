const core = require("@actions/core");
const github = require("@actions/github");

const {
  doAddAssignees,
  doAddLabels,
  doCreateComment,
  doCreateCommentContent,
  doCreateIssue,
  doCreateIssueContent,
  doDeleteComment,
  doLockIssue,
  doRemoveAssignees,
  doSetLabels,
  doUnlockIssue,
  doUpdateIssue,
  doUpdateComment
} = require('./base.js');

const ALLACTIONS = [
  'add-assignees',
  'add-labels',
  'create-comment',
  'create-issue',
  'delete-comment',
  'lock-issue',
  'remove-assignees',
  'set-labels',
  'unlock-issue',
  'update-comment',
  'update-issue',
];

async function main() {
  try {
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const issueNumber = core.getInput('issue-number');
    const commentId = core.getInput('comment-id');

    const defaultBody = `Currently at ${owner}/${repo}. And this is default comment.`
    const body = core.getInput("body") || defaultBody;

    const defaultTitle = `Default Title`;
    const title = core.getInput("title") || defaultTitle;

    const assignees = core.getInput("assignees");

    const labels = core.getInput("labels");
    const state = core.getInput("state") || 'open';

    let updateMode = core.getInput("update-mode") || 'replace';
    if (updateMode !== 'append') {
      updateMode = 'replace';
    }

    const actions = core.getInput("actions", { required: true });

    if (typeof(actions) === 'object') {
      actions.forEach(item => {
        testActions(item);
      })
    } else {
      testActions(actions);
    }

    function testActions(action) {
      if (ALLACTIONS.includes(action)) {
        choseActions(action);
      } else {
        core.setFailed("This actions not supported!");
      }
    };

    async function choseActions(action) {
      switch (action) {
        case 'add-assignees':
          await doAddAssignees(owner, repo, issueNumber, assignees);
          break;
        case 'add-labels':
          await doAddLabels(owner, repo, issueNumber, labels);
          break;
        case 'create-comment':
          await doCreateComment(owner, repo, issueNumber, body);
          break;
        case 'create-issue':
          await doCreateIssue(owner, repo, title, body, labels, assignees);
          break;
        case 'delete-comment':
          await doDeleteComment(owner, repo, commentId);
          break;
        case 'lock-issue':
          await doLockIssue(owner, repo, issueNumber);
          break;
        case 'remove-assignees':
          await doRemoveAssignees(owner, repo, issueNumber, assignees);
          break;
        case 'set-labels':
          await doSetLabels(owner, repo, issueNumber, labels);
          break;
        case 'unlock-issue':
          await doUnlockIssue(owner, repo, issueNumber);
          break;
        case 'update-comment':
          await doUpdateComment(
            owner,
            repo,
            commentId,
            body,
            updateMode
          );
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
            labels
          );
          break;
        default:
          break;
      }
    };
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

main();
