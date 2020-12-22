require('dotenv').config();
const core = require("@actions/core");
const { Octokit } = require('@octokit/rest');

const ALLREACTIONS = [
  "+1",
  "-1",
  "laugh",
  "confused",
  "heart",
  "hooray",
  "rocket",
  "eyes",
];

const token = core.getInput('token') || process.env.GH_TOKEN;
const octokit = new Octokit({ auth: `token ${token}` });

const contents = core.getInput("contents");

async function doAddAssignees (owner, repo, issueNumber, assignees) {
  await octokit.issues.addAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees
  });
  core.info(`Actions: [add-assignees][${assignees}] success!`);
};

async function doAddLabels (owner, repo, issueNumber, labels) {
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels
  });
  core.info(`Actions: [add-labels][${labels}] success!`);
};

async function doCreateComment (owner, repo, issueNumber, body) {
  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body
  });
  core.info(`Actions: [create-comment][${body}] success!`);
  core.setOutput("comment-id", data.id);

  if (contents) {
    await doCreateCommentContent(owner, repo, data.id, contents);
  }
};

async function doCreateCommentContent(owner, repo, commentId) {
  if (typeof(contents) === 'object') {
    contents.forEach(async item => {
      if (testContent(item)) {
        await octokit.reactions.createForIssueComment({
          owner,
          repo,
          comment_id: commentId,
          content: item
        });
        core.info(`Actions: [create-reactions][${item}] success!`);
      }
    })
  } else if (typeof(contents) === 'string' && testContent(contents)) {
    await octokit.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: commentId,
      content: contents
    });
    core.info(`Actions: [create-reactions][${contents}] success!`);
  }
};

async function doCreateIssue (owner, repo, title, body, labels, assignees) {
  let params = {
    owner,
    repo,
    title,
    body,
    labels
  };
  if (typeof(assignees) === 'string') {
    params.assignees.push(assignees);
  } else {
    params.assignees = assignees;
  }
  const { data } = await octokit.issues.create(params);
  core.info(`Actions: [create-issue][${title}] success!`);
  core.setOutput("issue_number", data.number);

  if (contents) {
    await doCreateIssueContent(owner, repo, data.number, contents);
  }
};

async function doCreateIssueContent(owner, repo, issueNumber) {
  if (typeof(contents) === 'object') {
    contents.forEach(async item => {
      if (testContent(item)) {
        await octokit.reactions.createForIssue({
          owner,
          repo,
          issue_number: issueNumber,
          content: item
        });
        core.info(`Actions: [create-reactions][${item}] success!`);
      }
    })
  } else if (typeof(contents) === 'string' && testContent(contents)) {
    await octokit.reactions.createForIssue({
      owner,
      repo,
      issue_number: issueNumber,
      content: contents
    });
    core.info(`Actions: [create-reactions][${contents}] success!`);
  }
};

async function doDeleteComment (owner, repo, commentId) {
  await octokit.issues.deleteComment({
    owner,
    repo,
    comment_id: commentId
  });
  core.info(`Actions: [delete-comment][${commentId}] success!`);
};

async function doLockIssue (owner, repo, issueNumber) {
  await octokit.issues.lock({
    owner,
    repo,
    issue_number: issueNumber,
  });
  core.info(`Actions: [lock-issue][${issueNumber}] success!`);
};

async function doRemoveAssignees (owner, repo, issueNumber, assignees) {
  await octokit.issues.removeAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees
  });
  core.info(`Actions: [remove-assignees][${assignees}] success!`);
};

async function doSetLabels (owner, repo, issueNumber, labels) {
  await octokit.issues.setLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels
  });
  core.info(`Actions: [set-labels][${labels}] success!`);
};

async function doUnlockIssue (owner, repo, issueNumber) {
  await octokit.issues.unlock({
    owner,
    repo,
    issue_number: issueNumber,
  });
  core.info(`Actions: [unlock-issue][${issueNumber}] success!`);
};

async function doUpdateComment (
  owner,
  repo,
  commentId,
  body,
  updateMode
) {
  const comment = await octokit.issues.getComment({
    owner,
    repo,
    comment_id: commentId
  })
  const comment_body = comment.data.body;

  let params = {
    owner,
    repo,
    comment_id: commentId
  };

  if (updateMode === 'append') {
    params.body = `${comment_body}\n${body}`;
  } else {
    params.body = body;
  }

  await octokit.issues.updateComment(params);
  core.info(`Actions: [update-comment][${commentId}] success!`);

  if (contents) {
    await doCreateCommentContent(owner, repo, commentId, contents);
  }
};

async function doUpdateIssue (
  owner,
  repo,
  issueNumber,
  state,
  title,
  body,
  updateMode,
  assignees,
  labels
) {
  const issue = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber
  })
  const issue_body = issue.data.body;
  const issue_title = issue.data.title;
  const issue_labels = issue.data.labels;
  const issue_assignees = issue.data.assignees;

  let params = {
    owner,
    repo,
    issue_number: issueNumber,
    state
  };

  params.title = core.getInput("title") ? title : issue_title;

  let next_body;
  if (core.getInput("body")) {
    if (updateMode === 'append') {
      next_body = `${issue_body}\n${body}`;
    } else {
      next_body = body;
    }
  } else {
    next_body = issue_body;
  }
  params.body = next_body;

  if (core.getInput("assignees")) {
    if (typeof(assignees) === 'string') {
      params.assignees.push(assignees);
    } else {
      params.assignees = assignees;
    }
  } else {
    params.assignees = issue_assignees;
  }

  params.labels = labels ? labels : issue_labels;

  await octokit.issues.update(params);
  core.info(`Actions: [update-issue][${issueNumber}] success!`);

  if (contents) {
    await doCreateIssueContent(owner, repo, issueNumber, contents);
  }
};

// tool
function testContent(con) {
  if (ALLREACTIONS.includes(con)) {
    return true;
  } else {
    core.setFailed("This actions not supported!");
    return false;
  }
};

// exports
module.exports = {
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
};
