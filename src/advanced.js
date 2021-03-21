require('dotenv').config();
const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

const {
  doAddLabels,
  doCreateComment,
  doCloseIssue,
  doLockIssue,
  doCreateIssue,
} = require('./base.js');

const { doQueryIssues, getIssuesInMonth, getCreatedMonth } = require('./public.js');

const { dealStringToArr, matchKeyword, getPreMonth } = require('./util.js');

// **************************************************************************
var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// **************************************************************************
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

let direction = core.getInput('direction');
direction = direction === 'desc' ? 'desc' : 'asc';
const commentAuth = core.getInput('comment-auth');
const bodyIncludes = core.getInput('body-includes');
const titleIncludes = core.getInput('title-includes');
const titleRemove = core.getInput('title-excludes');
const assigneeIncludes = core.getInput('assignee-includes');

let issueState = core.getInput('issue-state') || 'open';
if (issueState != 'all' && issueState != 'closed') {
  issueState = 'open';
}

const inactiveLabel = core.getInput('inactive-label') || 'inactive';

// **************************************************************************
async function doCheckInactive(owner, repo, labels) {
  const issues = await doQueryIssues(owner, repo, labels, issueState);

  if (issues.length) {
    for (let i = 0; i < issues.length; i++) {
      let arr = [];
      issues[i].labels.forEach(it => {
        arr.push(it.name);
      });
      if (!arr.includes(inactiveLabel)) {
        await doAddLabels(owner, repo, issues[i].number, inactiveLabel);
        if (core.getInput('body')) {
          await doCreateComment(owner, repo, issues[i].number, core.getInput('body'));
        }
      } else {
        core.info(`Actions: [add-inactive] issue ${issues[i].number} has label!`);
      }
    }
  } else {
    core.info(`Actions: [query-issues] empty!`);
  }
}

/**
 * 检查 issue 是否满足条件，满足返回 true
 * 当前 issue 的指定人是否有一个满足 assigneeIncludes 里的某个
 * 关键字匹配，是否包含前一个某个+后一个某个 '官网,网站/挂了,无法访问'
 */
async function doCheckIssue(owner, repo, issueNumber) {
  let checkResult = true;
  const issue = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  if (!!checkResult && assigneeIncludes) {
    let assigneesCheck = dealStringToArr(assigneeIncludes);
    let checkAssignee = false;
    issue.data.assignees.forEach(it => {
      if (checkResult && !checkAssignee && assigneesCheck.includes(it.login)) {
        checkResult = true;
        checkAssignee = true;
      }
    });
    !checkAssignee ? (checkResult = false) : null;
  }

  if (!!checkResult && titleRemove) {
    const removes = dealStringToArr(titleRemove);
    let t = issue.data.title;
    removes.forEach(re => {
      t = t.replace(re, '');
    });
    if (t.trim().length == 0) {
      checkResult = false;
    }
  }

  if (!!checkResult && titleIncludes) {
    const titleArr = titleIncludes.split('/');
    const keyword1 = dealStringToArr(titleArr[0]);
    const keyword2 = dealStringToArr(titleArr[1]);
    checkResult = keyword2.length
      ? matchKeyword(issue.data.title, keyword1) && matchKeyword(issue.data.title, keyword2)
      : matchKeyword(issue.data.title, keyword1);
  }

  if (!!checkResult && bodyIncludes) {
    const bodyArr = bodyIncludes.split('/');
    const keyword1 = dealStringToArr(bodyArr[0]);
    const keyword2 = dealStringToArr(bodyArr[1]);
    checkResult = keyword2.length
      ? matchKeyword(issue.data.body, keyword1) && matchKeyword(issue.data.body, keyword2)
      : matchKeyword(issue.data.body, keyword1);
  }
  core.info(`Actions: [check-issue][${!!checkResult}] success!`);
  core.setOutput('check-result', !!checkResult);
}

async function doCloseIssues(owner, repo, labels) {
  const issues = await doQueryIssues(owner, repo, labels, 'open');

  if (issues.length) {
    for (let i = 0; i < issues.length; i++) {
      await doCloseIssue(owner, repo, issues[i].number);
      if (core.getInput('body')) {
        await doCreateComment(owner, repo, issues[i].number, core.getInput('body'));
      }
    }
  } else {
    core.info(`Actions: [query-issues] empty!`);
  }
}

async function doFindComments(owner, repo, issueNumber) {
  const commentList = await listComments(owner, repo, issueNumber);
  core.info(`Actions: [find-comments][${issueNumber}] success!`);
  let comments = [];
  commentList.forEach(item => {
    const a = commentAuth ? item.user.login === commentAuth : true;
    const b = bodyIncludes ? item.body.includes(bodyIncludes) : true;
    if (a && b) {
      comments.push({
        id: item.id,
        auth: item.user.login,
        body: item.body,
        created: item.created_at,
        updated: item.updated_at,
      });
      if (direction === 'desc') {
        comments.reverse();
      }
    }
  });
  core.setOutput('comments', comments);
  core.info(`out-comments: ${JSON.stringify(comments)}`);
}

async function listComments(owner, repo, issueNumber, page = 1) {
  let { data: comments } = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
    page,
  });
  if (comments.length >= 100) {
    comments = comments.concat(await listComments(page + 1));
  }
  return comments;
}

async function doLockIssues(owner, repo, labels) {
  const issues = await doQueryIssues(owner, repo, labels, issueState);

  if (issues.length) {
    for (let i = 0; i < issues.length; i++) {
      await doLockIssue(owner, repo, issues[i].number);
      if (core.getInput('body')) {
        await doCreateComment(owner, repo, issues[i].number, core.getInput('body'));
      }
    }
  } else {
    core.info(`Actions: [query-issues] empty!`);
  }
}

async function doMonthStatistics(owner, repo, labels, assignees) {
  const countLables = core.getInput('count-lables');
  const countComments = core.getInput('count-comments');

  const thisMonth = dayjs.utc().month() + 1;
  const year = thisMonth == 1 ? dayjs.utc().year() - 1 : dayjs.utc().year();

  const month = getPreMonth(thisMonth);
  const showMonth = month < 10 ? `0${month}` : month;

  let issues = await getIssuesInMonth(owner, repo, thisMonth);
  if (issues.length == 0) {
    core.info(`Actions: [query-issues-${month}] empty!`);
    return false;
  }
  issues = issues.filter(i => {
    return getCreatedMonth(i.created_at) == month;
  });
  let total = issues.length;
  let totalIssues = [...issues];
  let openTotal = 0;
  let openIssuesNumber = [];
  let closeTotal = 0;
  let closeIssuesNumber = [];
  let labelsTotals = [];
  const title = `[${owner}/${repo}] Month Statistics: ${year}-${showMonth}`;
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
      });
    }
  }
  let now = dayjs().utc().format('YYYY-MM-DD HH:mm:ss');
  let body = `
- Created time: ${now}

- Time base: UTC +0
`;
  let totalShow = `
### Count

| Total | Open | Closed |
| -- | -- | -- |
| ${total} | ${openTotal} | ${closeTotal} |

`;

  body += totalShow;

  if (countLables == 'true') {
    let labelsArr = [];
    for (var lab in labelsTotals) {
      labelsArr.push({
        labelName: lab,
        number: labelsTotals[lab],
      });
    }
    labelsArr.sort((a, b) => b.number - a.number);
    let labelsTitle = `
### Labels statistics

<table>
<tr>
<th>Name</th>
<th>Number</th>
</tr>`;
    let labelsBody = '';
    labelsArr.forEach(it => {
      labelsBody += `<tr><td>${it.labelName}</td><td>${it.number}</td></tr>`;
    });
    body =
      body +
      labelsTitle +
      labelsBody +
      `</table>

`;
  }

  if (countComments == 'true') {
    totalIssues.sort((a, b) => b.comments - a.comments);
    const maxComments = totalIssues.slice(0, 3);
    let commentTitle = `
### Most comments

<table>
<tr>
<th>#</th>
<th>Issue</th>
<th>Title</th>
<th>Number</th>
<th>State</th>
</tr>
`;
    let commentBody = '';
    maxComments.forEach((it, ind) => {
      commentBody += `<tr>
<td>${ind + 1}</td>
<td>${it.number}</td>
<td>${it.title}</td>
<td>${it.comments}</td>
<td>${it.state}</td></tr>`;
    });
    body = body + commentTitle + commentBody + '</table>';
  }

  await doCreateIssue(owner, repo, title, body, labels, assignees);
}

// **************************************************************************
module.exports = {
  doCheckInactive,
  doCheckIssue,
  doCloseIssues,
  doFindComments,
  doLockIssues,
  doMonthStatistics,
};
