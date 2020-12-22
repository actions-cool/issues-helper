require('dotenv').config();
const core = require("@actions/core");
const { Octokit } = require('@octokit/rest');

const token = core.getInput('token') || process.env.GH_TOKEN;
const octokit = new Octokit({ auth: `token ${token}` });
