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
  doCreateIssue,
  doLockIssue
} = require('./base.js');

const { dealInput, getPreMonth, matchKeyword } = require('./util.js');

const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

let direction = core.getInput("direction");
direction = direction === 'desc' ? 'desc' : 'asc';

const commentAuth = core.getInput("comment-auth");
const bodyIncludes = core.getInput('body-includes');
const titleIncludes = core.getInput('title-includes');
const assigneeIncludes = core.getInput('assignee-includes');

const issueCreator = core.getInput("issue-creator");
const issueAssignee = core.getInput('issue-assignee');
const issueMentioned = core.getInput('issue-mentioned');

let issueState = core.getInput("issue-state") || 'open';

if (issueState != 'all' && issueState != 'closed') {
  issueState = 'open';
}

const inactiveDay = core.getInput("inactive-day");
const inactiveLabel = core.getInput("inactive-label") || 'inactive';

const perPage = 100;

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

/**
 * 检查 issue 是否满足条件，满足返回 true
 * 当前 issue 的指定人是否有一个满足 assigneeIncludes 里的某个
 * 关键字匹配，是否包含前一个某个+后一个某个 '官网,网站/挂了,无法访问'
 */
async function doCheckIssue (owner, repo, issueNumber) {
  var checkResult = true;
  const issue = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber
  });

  if (!!checkResult && assigneeIncludes) {
    let assigneesCheck = dealInput(assigneeIncludes);
    let checkAssignee = false;
    issue.data.assignees.forEach(it => {
      if (checkResult && !checkAssignee && assigneesCheck.includes(it.login)) {
        checkResult = true;
        checkAssignee = true;
      }
    })
    !checkAssignee ? checkResult = false : null;
  }

  if (!!checkResult && titleIncludes) {
    const titleArr = titleIncludes.split('/');
    const keyword1 = dealInput(titleArr[0]);
    const keyword2 = dealInput(titleArr[1]);
    checkResult =
      keyword2.length ?
        matchKeyword(issue.data.title, keyword1) && matchKeyword(issue.data.title, keyword2) :
        matchKeyword(issue.data.title, keyword1);
  }

  if (!!checkResult && bodyIncludes) {
    const bodyArr = bodyIncludes.split('/');
    const keyword1 = dealInput(bodyArr[0]);
    const keyword2 = dealInput(bodyArr[1]);
    checkResult =
      keyword2.length ?
        matchKeyword(issue.data.body, keyword1) && matchKeyword(issue.data.body, keyword2) :
        matchKeyword(issue.data.body, keyword1);
  }
  core.info(`Actions: [check-issue][${!!checkResult}] success!`);
  core.setOutput("check-result", !!checkResult);
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

async function doMonthStatistics (owner, repo, labels, assignees) {
  const countLables = core.getInput("count-lables");
  const countComments = core.getInput("count-comments");

  const thisMonth = dayjs.utc().month() + 1;
  const year = thisMonth == 1 ? dayjs.utc().year() - 1 : dayjs.utc().year();

  const month = getPreMonth(thisMonth);
  const showMonth = month < 10 ? `0${month}` : month;

  let issues = await getIssuesInMonth(
    'ant-design',
    'ant-design',
    thisMonth
  );
  if (issues.length == 0) {
    core.info(`Actions: [query-issues-${month}] empty!`);
    return false;
  }
  issues = issues.filter(i => {
    return getCreatedMontn(i.created_at) == month
  });
  let total = issues.length;
  let totalIssues = [...issues];
  let openTotal = 0;
  let openIssuesNumber = [];
  let closeTotal = 0;
  let closeIssuesNumber = [];
  let labelsTotals = [];
  const title = core.getInput("title") ? core.getInput("title") : `[${owner}/${repo}] Month Statistics: ${year}-${showMonth}`;
  for (let i = 0; i < issues.length; i++) {
    if (issues[i].state == 'closed') {
      closeTotal += 1;
      closeIssuesNumber.push(issues[i].number);
    } else if (issues[i].state == 'open') {
      openTotal += 1;
      openIssuesNumber.push(issues[i].number);
    }
    if (countLables && issues[i].labels) {
      issues[i].labels.forEach(l => {
        if (l.name in labelsTotals) {
          labelsTotals[l.name] += 1;
        } else {
          labelsTotals[l.name] = 1;
        }
      })
    }
  }

  console.log(total, openTotal, closeTotal);
  // console.log(openIssuesNumber);
  if (countComments) {
    totalIssues.sort((a, b) => b.comments - a.comments);
    const maxComments = totalIssues.slice(0, 3);
    console.log(maxComments);
  }

  if (countLables) {
    let labelsArr = [];
    for (var lab in labelsTotals) {
      labelsArr.push({
        labelName: lab,
        number: labelsTotals[lab]
      })
    }
    labelsArr.sort((a, b) => b.number - a.number);
    console.log(labelsArr);
  }

  let body = '';
  let totalShow = `
| Total | Open | Closed |
| -- | -- | -- |
| ${total} | ${openTotal} | ${closeTotal} |
`;

  body += totalShow;

  console.log(title)
  console.log(body)
  await doCreateIssue(owner, repo, title, body, labels, assignees);
};


// Tool
async function doQueryIssues (owner, repo, labels, state, creator) {
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
    })
    core.info(`Actions: [query-issues]: [${JSON.stringify(issueNumbers)}]!`);
  }

  return issues;
};

async function getIssues (params, page = 1) {
  let { data: issues } = await octokit.issues.listForRepo({
    ...params,
    per_page: perPage,
    page
  });
  if (issues.length >= perPage) {
    issues = issues.concat(await getIssues(params, page + 1));
  }
  return issues;
};

async function getIssuesInMonth (owner, repo, thisMonth, page = 1) {
  const month = getPreMonth(thisMonth);
  let { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    per_page: perPage,
    page
  });
  issues = issues.filter(i => {
    return i.pull_request === undefined
  });
  if (issues.length && getCreatedMontn(issues[issues.length - 1].created_at) >= month) {
    issues = issues.concat(await getIssuesInMonth(owner, repo, month, page + 1));
  }
  return issues;
};

function getCreatedMontn (d) {
  return dayjs(d).utc().month() + 1;
};

module.exports = {
  doCheckInactive,
  doCheckIssue,
  doCloseIssues,
  doFindComments,
  doLockIssues,
  doMonthStatistics,

  // tool
  doQueryIssues,
};
