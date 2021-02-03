require('dotenv').config();
const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

// **************************************************************************
const ALLREACTIONS = ['+1', '-1', 'laugh', 'confused', 'heart', 'hooray', 'rocket', 'eyes'];

const { doQueryIssues } = require('./public.js');

const {
  dealStringToArr,
  dealRandomAssignees,
  testDuplicate,
  checkPermission,
} = require('./util.js');

// **************************************************************************
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });
const context = github.context;

const contents = core.getInput('contents');

const randomTo = core.getInput('random-to');

// **************************************************************************
async function doAddAssignees(owner, repo, issueNumber, assignees) {
  const arr = dealRandomAssignees(assignees, randomTo);
  await octokit.issues.addAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees: arr,
  });
  core.info(`Actions: [add-assignees][${arr}] success!`);
}

async function doAddLabels(owner, repo, issueNumber, labels) {
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels: dealStringToArr(labels),
  });
  core.info(`Actions: [add-labels][${labels}] success!`);
}

async function doCloseIssue(owner, repo, issueNumber) {
  await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed',
  });
  core.info(`Actions: [close-issue][${issueNumber}] success!`);
}

async function doCreateComment(owner, repo, issueNumber, body) {
  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
  core.info(`Actions: [create-comment][${body}] success!`);
  core.setOutput('comment-id', data.id);

  if (contents) {
    await doCreateCommentContent(owner, repo, data.id, dealStringToArr(contents));
  }
}

async function doCreateCommentContent(owner, repo, commentId, contents) {
  if (contents.length) {
    contents.forEach(async item => {
      if (testContent(item)) {
        await octokit.reactions.createForIssueComment({
          owner,
          repo,
          comment_id: commentId,
          content: item,
        });
        core.info(`Actions: [create-reactions][${item}] success!`);
      }
    });
  }
}

async function doCreateIssue(owner, repo, title, body, labels, assignees) {
  let params = {
    owner,
    repo,
    title,
    body,
    labels: dealStringToArr(labels),
    assignees: dealRandomAssignees(assignees, randomTo),
  };

  const { data } = await octokit.issues.create(params);
  core.info(`Actions: [create-issue][${title}] success!`);
  core.setOutput('issue-number', data.number);

  if (contents) {
    await doCreateIssueContent(owner, repo, data.number, dealStringToArr(contents));
  }
}

async function doCreateIssueContent(owner, repo, issueNumber, contents) {
  if (contents.length) {
    contents.forEach(async item => {
      if (testContent(item)) {
        await octokit.reactions.createForIssue({
          owner,
          repo,
          issue_number: issueNumber,
          content: item,
        });
        core.info(`Actions: [create-reactions][${item}] success!`);
      }
    });
  }
}

async function doCreateLabel(owner, repo) {
  const name = core.getInput('label-name');
  const color = core.getInput('label-color') || 'ededed';
  const description = core.getInput('label-desc') || '';

  if (!name) {
    core.setFailed(`This actions should input 'label-name'!`);
    return false;
  }

  try {
    await octokit.issues.createLabel({
      owner,
      repo,
      name,
      color,
      description,
    });
    core.info(`Actions: [create-label][${name}] success!`);
  } catch (err) {
    console.log(err.message);
  }
}

async function doDeleteComment(owner, repo, commentId) {
  await octokit.issues.deleteComment({
    owner,
    repo,
    comment_id: commentId,
  });
  core.info(`Actions: [delete-comment][${commentId}] success!`);
}

async function doLockIssue(owner, repo, issueNumber) {
  const lockReason = core.getInput('lock-reason');
  let params = {
    owner,
    repo,
    issue_number: issueNumber,
  };
  const reasons = ['off-topic', 'too heated', 'resolved', 'spam'];
  if (lockReason && reasons.includes(lockReason)) {
    params.lock_reason = lockReason;
  }
  await octokit.issues.lock(params);
  core.info(`Actions: [lock-issue][${issueNumber}] success!`);
}

async function doMarkDuplicate(owner, repo, labels) {
  if (context.eventName != 'issue_comment') {
    core.info(`This actions only support on 'issue_comment'!`);
    return false;
  }

  if (context.payload.action == 'created' || context.payload.action == 'edited') {
    const duplicateCommand = core.getInput('duplicate-command');
    const duplicateLabels = core.getInput('duplicate-labels');
    const removeLables = core.getInput('remove-labels');
    const closeIssue = core.getInput('close-issue');
    const requirePermission = core.getInput('require-permission') || 'write';

    const commentId = context.payload.comment.id;
    const commentBody = context.payload.comment.body;
    const commentUser = context.payload.comment.user.login;
    const issueNumber = context.payload.issue.number;

    const ifCommandInput = !!duplicateCommand;

    if (
      !commentBody.includes('?') &&
      ((ifCommandInput &&
        commentBody.startsWith(duplicateCommand) &&
        commentBody.split(' ')[0] == duplicateCommand) ||
        testDuplicate(commentBody))
    ) {
      try {
        const res = await octokit.repos.getCollaboratorPermissionLevel({
          owner,
          repo,
          username: commentUser,
        });
        const { permission } = res.data;
        if (!checkPermission(requirePermission, permission)) {
          core.info(`The user ${commentUser} is not allow!`);
          return false;
        }

        if (ifCommandInput) {
          const nextBody = commentBody.replace(duplicateCommand, 'Duplicate of');
          await doUpdateComment(owner, repo, commentId, nextBody, 'replace', true);
        } else if (contents) {
          await doCreateCommentContent(owner, repo, commentId, dealStringToArr(contents));
        }
  
        const issue = await octokit.issues.get({
          owner,
          repo,
          issue_number: issueNumber,
        });
        let newLabels = [];
        if (issue.data.labels.length > 0) {
          newLabels = issue.data.labels
            .map(({ name }) => name)
            .filter(name => !dealStringToArr(removeLables).includes(name));
        }
        if (duplicateLabels) {
          newLabels = [...newLabels, ...dealStringToArr(duplicateLabels)];
        }
        if (labels) {
          newLabels = dealStringToArr(labels);
        }
        if (newLabels.length > 0) {
          await doSetLabels(owner, repo, issueNumber, newLabels.toString());
          core.info(`Actions: [mark-duplicate-labels][${newLabels}] success!`);
        }
  
        if (closeIssue == 'true') {
          await doCloseIssue(owner, repo, issueNumber);
        }
      } catch (error) {
        core.info(error.message);
      }
    } else {
      core.info(
        `This comment body should start whith 'duplicate-command' or 'Duplicate of' and not include '?'`,
      );
    }
  } else {
    core.info(`This actions only support on 'issue_comment' created or edited!`);
  }
}

async function doOpenIssue(owner, repo, issueNumber) {
  await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'open',
  });
  core.info(`Actions: [open-issue][${issueNumber}] success!`);
}

async function doRemoveAssignees(owner, repo, issueNumber, assignees) {
  await octokit.issues.removeAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees: dealStringToArr(assignees),
  });
  core.info(`Actions: [remove-assignees][${assignees}] success!`);
}

async function doRemoveLabels(owner, repo, issueNumber, labels) {
  const dealLabels = dealStringToArr(labels);
  for (label of dealLabels) {
    await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number: issueNumber,
      name: label,
    });
    core.info(`Actions: [remove-labels-foreach][${label}] success!`);
  }
  core.info(`Actions: [remove-labels][${labels}] success!`);
}

async function doSetLabels(owner, repo, issueNumber, labels) {
  // 概率性出现问题：https://github.com/octokit/rest.js/issues/1982，规避 setLabels
  if (labels) {
    // await octokit.issues.setLabels({
    //   owner,
    //   repo,
    //   issue_number: issueNumber,
    //   labels: dealStringToArr(labels)
    // });
    const issue = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });
    const baseLabels = issue.data.labels.map(({ name }) => name);
    const removeLabels = baseLabels.filter(name => !dealStringToArr(labels).includes(name));
    const addLabels = dealStringToArr(labels).filter(name => !baseLabels.includes(name));

    if (removeLabels.length > 0) {
      await doRemoveLabels(owner, repo, issueNumber, removeLabels.toString());
      core.info(`Actions: [set-labels-remove][${removeLabels}] success!`);
    }

    if (addLabels.length > 0) {
      await doAddLabels(owner, repo, issueNumber, addLabels.toString());
      core.info(`Actions: [set-labels-add][${addLabels}] success!`);
    }

    core.info(`Actions: [set-labels][${labels}] success!`);
  }
}

async function doUnlockIssue(owner, repo, issueNumber) {
  await octokit.issues.unlock({
    owner,
    repo,
    issue_number: issueNumber,
  });
  core.info(`Actions: [unlock-issue][${issueNumber}] success!`);
}

async function doUpdateComment(owner, repo, commentId, body, updateMode, ifUpdateBody) {
  const comment = await octokit.issues.getComment({
    owner,
    repo,
    comment_id: commentId,
  });
  const comment_body = comment.data.body;

  let params = {
    owner,
    repo,
    comment_id: commentId,
  };

  if (core.getInput('body') || ifUpdateBody) {
    if (updateMode === 'append') {
      params.body = `${comment_body}\n${body}`;
    } else {
      params.body = body;
    }

    await octokit.issues.updateComment(params);
    core.info(`Actions: [update-comment][${commentId}] success!`);
  }

  if (contents) {
    await doCreateCommentContent(owner, repo, commentId, dealStringToArr(contents));
  }
}

async function doUpdateIssue(
  owner,
  repo,
  issueNumber,
  state,
  title,
  body,
  updateMode,
  assignees,
  labels,
) {
  const issue = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });
  const issue_body = issue.data.body;
  const issue_title = issue.data.title;

  let issue_labels = [];
  if (issue.data.labels.length > 0) {
    issue.data.labels.forEach(it => {
      issue_labels.push(it.name);
    });
  }

  let issue_assignees = [];
  if (issue.data.assignees.length > 0) {
    issue.data.assignees.forEach(it => {
      issue_assignees.push(it.login);
    });
  }

  let params = {
    owner,
    repo,
    issue_number: issueNumber,
    state,
  };

  params.title = core.getInput('title') ? title : issue_title;

  let next_body;
  if (core.getInput('body')) {
    if (updateMode === 'append') {
      next_body = `${issue_body}\n${body}`;
    } else {
      next_body = body;
    }
  } else {
    next_body = issue_body;
  }
  params.body = next_body;

  params.labels = labels ? dealStringToArr(labels) : issue_labels;
  params.assignees = assignees ? dealStringToArr(assignees) : issue_assignees;

  await octokit.issues.update(params);
  core.info(`Actions: [update-issue][${issueNumber}] success!`);

  if (contents) {
    await doCreateIssueContent(owner, repo, issueNumber, contents);
  }
}

async function doWelcome(owner, repo, assignees, labels, body) {
  const context = github.context;
  const isIssue = !!context.payload.issue;
  const issueContents = core.getInput('issue-contents');
  if (!isIssue) {
    core.setFailed('The event that triggered this action must be a issue. Error!');
  } else {
    const auth = context.payload.sender.login;
    core.info(`Actions: [welcome: auth=][${auth}]`);
    const issueNumber = context.issue.number;
    const issues = await doQueryIssues(owner, repo, false, 'all', auth);
    if (issues.length == 0 || (issues.length == 1 && issues[0].number == issueNumber)) {
      if (core.getInput('body')) {
        await doCreateComment(owner, repo, issueNumber, body);
      } else {
        core.info(`Actions: [welcome] no body!`);
      }

      if (assignees) {
        await doAddAssignees(owner, repo, issueNumber, assignees);
      }

      if (labels) {
        await doAddLabels(owner, repo, issueNumber, labels);
      }

      if (issueContents) {
        await doCreateIssueContent(owner, repo, issueNumber, dealStringToArr(issueContents));
      }
    } else {
      core.info(`Actions: [welcome][${auth}] is not first time!`);
    }
  }
}

// **************************************************************************
function testContent(con) {
  if (ALLREACTIONS.includes(con)) {
    return true;
  } else {
    core.setFailed('This actions not supported!');
    return false;
  }
}

// **************************************************************************
module.exports = {
  doAddAssignees,
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doCreateCommentContent,
  doCreateIssue,
  doCreateIssueContent,
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
};
