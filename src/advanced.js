require('dotenv').config();
const core = require("@actions/core");
const { Octokit } = require('@octokit/rest');

var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

const {
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doLockIssue
} = require('./base.js');

const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

let direction = core.getInput("direction");
direction = direction === 'desc' ? 'desc' : 'asc';

const commentAuth = core.getInput("comment-auth");
const bodyIncludes = core.getInput('body-includes');
const titleIncludes = core.getInput('title-includes');

const issueCreator = core.getInput("issue-creator");
const issueAssignee = core.getInput('issue-assignee');
const issueMentioned = core.getInput('issue-mentioned');

let issueState = core.getInput("issue-state") || 'all';

if (issueState != 'open' && issueState != 'closed') {
  issueState = 'all';
}

const inactiveDay = core.getInput("inactive-day");
const inactiveLabel = core.getInput("inactive-label") || 'inactive';

async function doCheckInactive (owner, repo, labels) {
  const issues = await doQueryIssues(owner, repo, labels, issueState);

  if (issues.length) {
    for (let i = 0; i < issues.length; i++) {
      if (!JSON.stringify(issues[i].labels).includes(inactiveLabel)) {
        await doAddLabels(owner, repo, issues[i].number, inactiveLabel);
        if (core.getInput("body")) {
          await doCreateComment(owner, repo, issues[i].number, core.getInput("body"));
        }
      } else {
        core.info(`Actions: [add-inactive] issue ${issues[i].number} has label!`);
      }
    }
  } else {
    core.info(`Actions: [query-issues] empty!`);
  }
};

async function doCloseIssues (owner, repo, labels) {
  const issues = await doQueryIssues(owner, repo, labels, 'open');

  if (issues.length) {
    for (let i = 0; i < issues.length; i++) {
      await doCloseIssue(owner, repo, issues[i].number);
      if (core.getInput("body")) {
        await doCreateComment(owner, repo, issues[i].number, core.getInput("body"));
      }
    }
  } else {
    core.info(`Actions: [query-issues] empty!`);
  }
};

async function doFindComments (owner, repo, issueNumber) {
  const res = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber
  });
  core.info(`Actions: [find-comments][${issueNumber}] success!`);
  let comments = [];
  res.data.forEach(item => {
    const a = commentAuth ? item.user.login === commentAuth : true;
    const b = bodyIncludes ? item.body.includes(bodyIncludes) : true;
    if (a && b) {
      comments.push({
        id: item.id,
        auth: item.user.login,
        body: item.body,
        created: item.created_at,
        updated: item.updated_at
      })
      if (direction === 'desc') {
        comments.reverse();
      }
    }
  })
  core.setOutput("comments", comments);
};

async function doLockIssues (owner, repo, labels) {
  const issues = await doQueryIssues(owner, repo, labels, issueState);

  if (issues.length) {
    for (let i = 0; i < issues.length; i++) {
      await doLockIssue(owner, repo, issues[i].number);
      if (core.getInput("body")) {
        await doCreateComment(owner, repo, issues[i].number, core.getInput("body"));
      }
    }
  } else {
    core.info(`Actions: [query-issues] empty!`);
  }
};

async function doQueryIssues (owner, repo, labels, state) {
  let params = {
    owner,
    repo,
    state,
  };

  issueCreator ? params.creator = issueCreator : null;
  issueAssignee ? params.assignee = issueAssignee : null;
  issueMentioned ? params.mentioned = issueMentioned : null;

  if (labels) {
    params.labels = labels;
  }

  const res = await octokit.issues.listForRepo(params);
  let issues = [];
  res.data.forEach(iss => {
    const a = bodyIncludes ? iss.body.includes(bodyIncludes) : true;
    const b = titleIncludes ? iss.title.includes(titleIncludes) : true;
    if (a && b) {
      if (inactiveDay && typeof(inactiveDay) === 'number') {
        let lastTime = dayjs.utc().subtract(inactiveDay, 'day');
        let updateTime = dayjs.utc(iss.updated_at);
        if (updateTime.isSameOrBefore(lastTime)) {
          issues.push(iss);
        }
      } else {
        issues.push(iss);
      }
    }
  })

  return issues;
};

module.exports = {
  doCheckInactive,
  doCloseIssues,
  doFindComments,
  doLockIssues,
};
