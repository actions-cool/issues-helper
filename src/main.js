require('dotenv').config();

const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/rest');

const {
  doAddAssignees
} = require('./tool');

const ALLACTIONS = [
  'add-assignees',
  'add-labels'
];

async function main() {
  try { 
    const token = core.getInput('token') || process.env.GH_TOKEN;

    const octokit = new Octokit({ auth: `token ${token}` });
    // const owner = github.context.repo.owner;
    // const repo = github.context.repo.repo;
    const owner = 'actions-cool';
    const repo = 'issue-helper';
    const issueNumber = core.getInput('issue-number') || 1;
    const commentId = core.getInput('comment-id');
    const body = core.getInput("body");
    // const assignees = core.getInput("assignees");
    const assignees = 'xrkffgg'

    const actions = ['add-assignees', 'add-labels'];
    // const actions = core.getInput("actions", { required: true });

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
          await doAddAssignees(octokit, owner, repo, issueNumber, assignees);
        default: 
          break;
      }
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

main();
