const chalk = require('chalk');
const open = require('open');
const newGithubReleaseUrl = require('new-github-release-url');
const { readFileSync } = require('fs');
const path = require('path');

let tag = '';

const CHANGELOG_NAME = 'CHANGELOG.md';
const user = 'actions-cool';
const repo = 'issues-helper';

function getChangelog(content) {
  const lines = content.split('\n');
  const changeLog = [];
  const pin = /^## /;
  let begin = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (begin && pin.test(line)) {
      break;
    }
    if (begin && line) {
      changeLog.push(line);
    }
    if (!begin) {
      begin = pin.test(line);
      if (begin) {
        tag = line.substring(3, line.length).trim();
      }
    }
  }
  return changeLog.join('\n');
}

const changelogPath = path.join(__dirname, '..', CHANGELOG_NAME);
const changelog = readFileSync(changelogPath, 'utf-8');

const body = getChangelog(changelog);

async function run() {
  const url = newGithubReleaseUrl({
    user,
    repo,
    tag,
    body: body,
  });

  await open(url);

  console.log(chalk.yellow('🚀 Please check tag and changelog. Then click publish!'));
}

run();
