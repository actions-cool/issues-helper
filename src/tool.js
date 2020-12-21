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

const doAddAssignees = async ({
  octokit,
  owner,
  repo,
  issueNumber,
  assignees
}) => {
  await octokit.issues.addAssignees({
    owner,
    repo,
    issue_number: issueNumber,
    assignees
  });
};


module.exports = {
  doAddAssignees
};
