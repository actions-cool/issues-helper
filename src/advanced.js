require('dotenv').config();
const core = require("@actions/core");
const { Octokit } = require('@octokit/rest');

const token = core.getInput('token') || process.env.GH_TOKEN;
const octokit = new Octokit({ auth: `token ${token}` });

const commentAuth = core.getInput("comment-auth") || 'xrkffgg';
const bodyIncludes = core.getInput('body-includes') || 'is';
const titleIncludes = core.getInput('title-includes') || 'test';

const issueCreator = core.getInput("issue-creator") || 'xrkffgg';
const issueAssignee = core.getInput('issue-assignee');
const issueMentioned = core.getInput('issue-mentioned');

async function doCloseIssues (owner, repo, labels) {
  let params = {
    owner,
    repo,
    state: 'open',
  };

  issueCreator ? params.creator = issueCreator : null;
  issueAssignee ? params.assignee = issueAssignee : null;
  issueMentioned ? params.mentioned = issueMentioned : null;

  if (labels) {
    if (typeof(labels) === 'string') {
      params.labels = labels;
    } else {
      let temp = '';
      labels.forEach((it,index) => {
        index == labels.length - 1 ? temp += `${it}` : temp += `${it},`;
      })
      params.labels = temp;
    }
  }

  console.log(params.labels)

  const res = await octokit.issues.listForRepo(params);
  console.log(res);
  let issues = [];
  for (let i = 0; i < res.data.length; i++) {
    wip
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
    if ((commentAuth ? item.user.login === commentAuth : true) && (bodyIncludes ? item.body.includes(bodyIncludes) : true)) {
      comments.push({
        id: item.id,
        body: item.body
      })
    }
  })
  core.setOutput("comments", comments);
};





module.exports = {
  doCloseIssues,
  doFindComments,
};
