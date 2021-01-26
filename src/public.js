require('dotenv').config();
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

const { getPreMonth } = require('./util.js');

// **************************************************************************
var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

// **************************************************************************
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

const perPage = 100;

const issueCreator = core.getInput('issue-creator');
const issueAssignee = core.getInput('issue-assignee');
const issueMentioned = core.getInput('issue-mentioned');

const bodyIncludes = core.getInput('body-includes');
const titleIncludes = core.getInput('title-includes');

const inactiveDay = core.getInput('inactive-day');

// **************************************************************************
async function doQueryIssues(owner, repo, labels, state, creator) {
  let params = {
    owner,
    repo,
    state,
  };

  issueCreator ? (params.creator = issueCreator) : null;
  issueAssignee ? (params.assignee = issueAssignee) : null;
  issueMentioned ? (params.mentioned = issueMentioned) : null;

  if (labels) {
    params.labels = labels;
  }

  if (creator) {
    params.creator = creator;
  }

  const res = await getIssues(params);
  let issues = [];
  let issueNumbers = [];
  if (res.length) {
    res.forEach(iss => {
      const a = bodyIncludes ? iss.body.includes(bodyIncludes) : true;
      const b = titleIncludes ? iss.title.includes(titleIncludes) : true;
      /**
       * Note: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request.
       * For this reason, "Issues" endpoints may return both issues and pull requests in the response.
       * You can identify pull requests by the pull_request key.
       */
      if (a && b && iss.pull_request === undefined) {
        if (inactiveDay) {
          let lastTime = dayjs.utc().subtract(Number(inactiveDay), 'day');
          let updateTime = dayjs.utc(iss.updated_at);
          if (updateTime.isSameOrBefore(lastTime)) {
            issues.push(iss);
            issueNumbers.push(iss.number);
          }
        } else {
          issues.push(iss);
          issueNumbers.push(iss.number);
        }
      }
    });
    core.info(`Actions: [query-issues]: [${JSON.stringify(issueNumbers)}]!`);
  }

  return issues;
}

async function getIssues(params, page = 1) {
  let { data: issues } = await octokit.issues.listForRepo({
    ...params,
    per_page: perPage,
    page,
  });
  if (issues.length >= perPage) {
    issues = issues.concat(await getIssues(params, page + 1));
  }
  return issues;
}

async function getIssuesInMonth(owner, repo, thisMonth, page = 1) {
  const month = getPreMonth(thisMonth);
  let { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    per_page: perPage,
    page,
  });
  issues = issues.filter(i => {
    return i.pull_request === undefined;
  });
  if (issues.length && getCreatedMonth(issues[issues.length - 1].created_at) >= month) {
    issues = issues.concat(await getIssuesInMonth(owner, repo, thisMonth, page + 1));
  }
  return issues;
}

// **************************************************************************
function getCreatedMonth(d) {
  return (
    dayjs(d)
      .utc()
      .month() + 1
  );
}

// **************************************************************************
module.exports = {
  doQueryIssues,
  getIssues,
  getIssuesInMonth,
  getCreatedMonth,
};
