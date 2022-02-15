const chalk = require('chalk');
const simpleGit = require('simple-git/promise');

const cwd = process.cwd();
const git = simpleGit(cwd);

async function checkCommit({ files }) {
  if (files.length) {
    console.log(chalk.yellow('🙄 You forgot something to commit.'));
    files.forEach(({ path: filePath }) => {
      console.log(' -', chalk.red(filePath));
    });
    console.log('');
    process.exit(1);
  }
}

async function run() {
  const status = await git.status();
  await checkCommit(status);
}

run();
