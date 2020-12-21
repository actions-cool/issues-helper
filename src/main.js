const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require('@octokit/rest');

const REACTION_TYPES = [
  "+1",
  "-1",
  "laugh",
  "confused",
  "heart",
  "hooray",
  "rocket",
  "eyes",
];

async function main() {
  try { 
    const token = core.getInput('token');
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    console.log(owner, repo)
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

main();
