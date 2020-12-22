require('dotenv').config();
const core = require("@actions/core");
const { Octokit } = require('@octokit/rest');

const token = core.getInput('token') || process.env.GH_TOKEN;
const octokit = new Octokit({ auth: `token ${token}` });

const commentAuth = core.getInput("comment-auth") || 'xrkffgg';
const bodyIncludes = core.getInput('body-includes') || 'is';

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
  doFindComments,
};
