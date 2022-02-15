const chalk = require('chalk');
const simpleGit = require('simple-git/promise');
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const path = require('path');

const CHANGELOG_NAME = 'CHANGELOG.md';
const CHANGELOG_PATH = path.join(__dirname, '..', CHANGELOG_NAME);
const CHANGELOG = readFileSync(CHANGELOG_PATH, 'utf-8');

const cwd = process.cwd();
const git = simpleGit(cwd);

async function run() {
  execSync(`git pull`);

  const data = await git.tags();
  const tags = data.all;
  let tag = tags.reverse()[0];
  console.log(chalk.green(`[Git Query] tag: ${tag}`));

  const tagChangelog = getChangelogTag(CHANGELOG);
  if (tagChangelog && tag != tagChangelog) {
    console.log(chalk.yellow(`[Git Action] Push new ${tagChangelog} tag!`));
    execSync(`git tag ${tagChangelog}`);
    execSync(`git push origin ${tagChangelog}:${tagChangelog}`);
    execSync(`git pull`);
    tag = tagChangelog;
  } else {
    console.log(chalk.yellow('🙄 Please add new release changelog first.'));
    console.log('');
    process.exit(1);
  }

  const tagSimple = tag.startsWith('v') ? tag.substring(0, 2) : tag.substring(0, 1);
  console.log(chalk.green(`[Git Query] tagSimple: ${tagSimple}`));

  if (tags.includes(tagSimple)) {
    console.log(chalk.yellow(`[Git Action] Delete ${tagSimple} tag`));
    execSync(`git push origin :refs/tags/${tagSimple}`);
  }

  console.log(chalk.yellow(`[Git Action] Add new simple ${tagSimple} tag`));
  execSync(`git push origin ${tag}:${tagSimple}`);
  console.log(chalk.green('🎉 Done!'));
}

function getChangelogTag(content) {
  const lines = content.split('\n');
  const pin = /^## /;
  let begin = false;
  let tag = '';

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (begin && pin.test(line)) {
      break;
    }
    if (!begin) {
      begin = pin.test(line);
      if (begin) {
        tag = line.substring(3, line.length);
      }
    }
  }

  return tag.trim();
}

run();
