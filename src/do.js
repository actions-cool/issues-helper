require('dotenv').config();
const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/rest');

var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
var isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

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

const {
  dealInput,
  matchKeyword,
  testDuplicate,
  getPreMonth
} = require('./util.js');

const token = core.getInput('token');
// const token = core.getInput('token') || process.env.GH;

const octokit = new Octokit({ auth: `token ${token}` });

const contents = core.getInput("contents");
const issueContents = core.getInput("issue-contents");

// advanced
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

// 
const context = github.context;

// base
async function doAddAssignees (owner, repo, issueNumber, assignees) {
  await octokit.issues.addAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees: dealInput(assignees)
  });
  core.info(`Actions: [add-assignees][${assignees}] success!`);
};

async function doAddLabels (owner, repo, issueNumber, labels) {
  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels: dealInput(labels)
  });
  core.info(`Actions: [add-labels][${labels}] success!`);
};

async function doCloseIssue (owner, repo, issueNumber) {
  await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed'
  });
  core.info(`Actions: [close-issue][${issueNumber}] success!`);
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
    await doCreateCommentContent(owner, repo, data.id, dealInput(contents));
  }
};

async function doCreateCommentContent(owner, repo, commentId, contents) {
  if (contents.length) {
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
  }
};

async function doCreateIssue (owner, repo, title, body, labels, assignees) {
  let params = {
    owner,
    repo,
    title,
    body,
    labels: dealInput(labels),
    assignees: dealInput(assignees),
  };

  const { data } = await octokit.issues.create(params);
  core.info(`Actions: [create-issue][${title}] success!`);
  core.setOutput("issue-number", data.number);

  if (contents) {
    await doCreateIssueContent(owner, repo, data.number, dealInput(contents));
  }
};

async function doCreateIssueContent(owner, repo, issueNumber, contents) {
  if (contents.length) {
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

async function doMarkDuplicate (owner, repo, labels) {
  if (context.eventName != 'issue_comment') {
    core.info(`This actions only support on 'issue_comment'!`);
    return false;
  }
  if (context.payload.action != 'created') {
    core.info(`This actions only support on 'issue_comment' created!`);
    return false;
  }

  const duplicateCommand = core.getInput("duplicate-command");
  const duplicateLabels = core.getInput("duplicate-labels");
  const closeIssue = core.getInput("close-issue");
  
  const commentId = context.payload.comment.id;
  const commentBody = context.payload.comment.body;
  const issueNumber = context.payload.issue.number;

  const ifCommandInput = !!duplicateCommand;

  if ((ifCommandInput && commentBody.startsWith(duplicateCommand) && commentBody.split(' ')[0] == duplicateCommand) || testDuplicate(commentBody)) {
    if (ifCommandInput) {
      const nextBody = commentBody.replace(duplicateCommand, 'Duplicate of');
      await doUpdateComment(owner, repo, commentId, nextBody, 'replace', true);
    } else if (contents) {
      await doCreateCommentContent(owner, repo, commentId, dealInput(contents));
    }
    if (duplicateLabels) {
      await doAddLabels(owner, repo, issueNumber, duplicateLabels);
    }
    if (labels) {
      await doSetLabels(owner, repo, issueNumber, labels);
    }
    if (closeIssue == 'true') {
      await doCloseIssue(owner, repo, issueNumber);
    }
  } else {
    core.info(`This comment body should start whith 'duplicate-command'`);
  }
};

async function doOpenIssue (owner, repo, issueNumber) {
  await octokit.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'open'
  });
  core.info(`Actions: [open-issue][${issueNumber}] success!`);
};

async function doRemoveAssignees (owner, repo, issueNumber, assignees) {
  await octokit.issues.removeAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees: dealInput(assignees),
  });
  core.info(`Actions: [remove-assignees][${assignees}] success!`);
};

async function doRemoveLabels (owner, repo, issueNumber, labels) {
  const issue = await octokit.issues.get({
    owner,
    repo,
    issue_number: issueNumber
  });
  const dealLabels = dealInput(labels);
  let addLables = [];
  if (dealLabels.length) {
    issue.data.labels.forEach(item => {
      !dealLabels.includes(item.name) ? addLables.push(item.name) : '';
    })
    await octokit.issues.setLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: addLables
    });
    core.info(`Actions: [remove-labels][${labels}] success!`);
  }
};

async function doSetLabels (owner, repo, issueNumber, labels) {
  await octokit.issues.setLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels: dealInput(labels)
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
  updateMode,
  ifUpdateBody,
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

  if (core.getInput("body") || ifUpdateBody) {
    if (updateMode === 'append') {
      params.body = `${comment_body}\n${body}`;
    } else {
      params.body = body;
    }

    await octokit.issues.updateComment(params);
    core.info(`Actions: [update-comment][${commentId}] success!`);
  }

  if (contents) {
    await doCreateCommentContent(owner, repo, commentId, dealInput(contents));
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

  let issue_labels = [];
  if (issue.data.labels.length > 0) {
    issue.data.labels.forEach(it =>{
      issue_labels.push(it.name);
    });
  }

  let issue_assignees = [];
  if (issue.data.assignees.length > 0) {
    issue.data.assignees.forEach(it =>{
      issue_assignees.push(it.login);
    });
  }

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

  params.labels = labels ? dealInput(labels) : issue_labels;
  params.assignees = assignees ? dealInput(assignees) : issue_assignees;

  await octokit.issues.update(params);
  core.info(`Actions: [update-issue][${issueNumber}] success!`);

  if (contents) {
    await doCreateIssueContent(owner, repo, issueNumber, contents);
  }
};

async function doWelcome (owner, repo, assignees, labels, body) {
  const context = github.context;
  const isIssue = !!context.payload.issue;
  if (!isIssue) {
    core.setFailed("The event that triggered this action must be a issue. Error!");
  } else {
    const auth = context.payload.sender.login;
    core.info(`Actions: [welcome: auth=][${auth}]`);
    const issueNumber = context.issue.number;
    const creator = 'zoo-js-bot';
    const issues = await doQueryIssues(owner, repo, false, 'all', creator);
    if (issues.length == 0 || (issues.length == 1 && issues[0].number == issueNumber)) {
      if (core.getInput("body")) {
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
        await doCreateIssueContent(owner, repo, issueNumber, dealInput(issueContents));
      }
    } else {
      core.info(`Actions: [welcome][${auth}] is not first time!`);
    }
  }
};

// advanced
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
  const countLables = core.getInput("count-lables") || true;
  const countComments = core.getInput("count-comments")|| true;

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
  const title = core.getInput("title") ? core.getInput("title") : `[ant-design/ant-design] Month Statistics: ${year}-${showMonth}`;
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

  if (countLables) {
    let labelsArr = [];
    for (var lab in labelsTotals) {
      labelsArr.push({
        labelName: lab,
        number: labelsTotals[lab]
      })
    }
    labelsArr.sort((a, b) => b.number - a.number);
    let labelsTitle = `
### Labels statistics

| Name | Number |
| -- | -- |`
    let labelsBody = '';
    labelsArr.forEach(it => {
      let labelNameShow = it.labelName.replace(/|/g, '\|');
      labelsBody += `
| ${labelNameShow} | ${it.number} |`
    })
    body = body + labelsTitle + labelsBody;
  }

  if (countComments) {
    totalIssues.sort((a, b) => b.comments - a.comments);
    const maxComments = totalIssues.slice(0, 3);
    let commentsShow = `
### Most commented

| # | Issue | Title | Number | State |
| -- | -- | -- | -- | -- |
| 1 | [${maxComments[0].number}](${maxComments[0].html_url}) | ${maxComments[0].title} | ${maxComments[0].comments} | ${maxComments[0].state} |
| 2 | [${maxComments[1].number}](${maxComments[1].html_url}) | ${maxComments[1].title} | ${maxComments[1].comments} | ${maxComments[1].state} |
| 3 | [${maxComments[2].number}](${maxComments[2].html_url}) | ${maxComments[2].title} | ${maxComments[2].comments} | ${maxComments[2].state} |

`
    body += commentsShow;
  }
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

// tool
function testContent(con) {
  if (ALLREACTIONS.includes(con)) {
    return true;
  } else {
    core.setFailed("This actions not supported!");
    return false;
  }
};

function getCreatedMontn (d) {
  return dayjs(d).utc().month() + 1;
};

// exports
module.exports = {
  // base
  doAddAssignees,
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doCreateCommentContent,
  doCreateIssue,
  doCreateIssueContent,
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

  // advanced
  doCheckInactive,
  doCheckIssue,
  doCloseIssues,
  doFindComments,
  doLockIssues,
  doMonthStatistics,
};
