import { Octokit } from '@octokit/rest';

import { EEmoji } from '../const';
import type {
  IIssueBaseInfo,
  IIssueCoreEngine,
  IListIssuesParams,
  TCloseReason,
  TCommentList,
  TEmoji,
  TIssueInfo,
  TIssueList,
  TIssueState,
  TLockReasons,
  TUpdateMode,
  TUserPermission,
} from '../types';

export class IssueCoreEngine implements IIssueCoreEngine {
  private owner!: string;
  private repo!: string;
  private issueNumber!: number;
  private octokit!: Octokit;

  public constructor(_info: IIssueBaseInfo) {
    if (_info.owner && _info.repo) {
      this.owner = _info.owner;
      this.repo = _info.repo;
      this.issueNumber = _info.issueNumber;
      this.octokit = new Octokit({ auth: `token ${_info.token}` });
    } else {
      console.error(`Init failed, need owner、repo!`);
    }
  }

  // Allow modify issue number in this way
  public setIssueNumber(newIssueNumber: number) {
    this.issueNumber = newIssueNumber;
  }

  public async addAssignees(assignees: string[]) {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.addAssignees({
      owner,
      repo,
      issue_number: issueNumber,
      assignees,
    });
  }

  public async addLabels(labels: string[]) {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels,
    });
  }

  public async closeIssue(reason: TCloseReason) {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
      state_reason: reason,
    });
  }

  public async createComment(body: string): Promise<number> {
    const { owner, repo, octokit, issueNumber } = this;
    const { data } = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });
    return data.id;
  }

  public async createCommentEmoji(commentId: number, emoji: TEmoji[]) {
    const { owner, repo, octokit } = this;
    for (const content of emoji) {
      if (content && EEmoji[content]) {
        await octokit.reactions.createForIssueComment({
          owner,
          repo,
          comment_id: commentId,
          content,
        });
      }
    }
  }

  public async createIssue(
    title: string,
    body: string,
    labels?: string[],
    assignees?: string[],
  ): Promise<number> {
    const { owner, repo, octokit } = this;
    const { data } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
    });
    return data.number;
  }

  public async createIssueEmoji(emoji: TEmoji[]) {
    const { owner, repo, octokit, issueNumber } = this;
    for (const content of emoji) {
      if (content && EEmoji[content]) {
        await octokit.reactions.createForIssue({
          owner,
          repo,
          issue_number: issueNumber,
          content,
        });
      }
    }
  }

  public async createLabel(
    labelName: string,
    labelColor: string = 'ededed',
    labelDescription: string = '',
  ) {
    const { owner, repo, octokit } = this;
    await octokit.issues.createLabel({
      owner,
      repo,
      name: labelName,
      color: labelColor,
      description: labelDescription,
    });
  }

  public async deleteComment(commentId: number) {
    const { owner, repo, octokit } = this;
    await octokit.issues.deleteComment({
      owner,
      repo,
      comment_id: commentId,
    });
  }

  public async getIssue() {
    const { owner, repo, octokit, issueNumber } = this;
    const issue = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });
    return issue.data as unknown as TIssueInfo;
  }

  public async getUserPermission(username: string) {
    const { owner, repo, octokit } = this;
    const { data } = await octokit.repos.getCollaboratorPermissionLevel({
      owner,
      repo,
      username,
    });
    return data.permission as TUserPermission;
  }

  public async listComments(page = 1) {
    const { octokit, owner, repo, issueNumber } = this;
    const { data } = await octokit.issues.listComments({
      owner,
      repo,
      issue_number: issueNumber,
      per_page: 100,
      page,
    });
    let comments = [...data] as unknown as TCommentList;
    if (comments.length >= 100) {
      comments = comments.concat(await this.listComments(page + 1));
    }
    return comments;
  }

  public async listIssues(params: IListIssuesParams, page = 1) {
    const { octokit, owner, repo } = this;
    const { data } = await octokit.issues.listForRepo({
      ...params,
      owner,
      repo,
      per_page: 100,
      page,
    });
    let issues = [...data] as unknown as TIssueList;
    if (issues.length >= 100) {
      issues = issues.concat(await this.listIssues(params, page + 1));
    }
    return issues;
  }

  public async lockIssue(lockReason: TLockReasons) {
    const { owner, repo, octokit, issueNumber } = this;
    const params: any = {
      owner,
      repo,
      issue_number: issueNumber,
    };
    if (lockReason) {
      params.lock_reason = lockReason;
    }
    await octokit.issues.lock(params);
  }

  public async openIssue() {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'open',
    });
  }

  public async removeAssignees(assignees: string[]) {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.removeAssignees({
      owner,
      repo,
      issue_number: issueNumber,
      assignees,
    });
  }

  public async removeLabels(labels: string[]) {
    const { owner, repo, octokit, issueNumber } = this;
    const issue = await this.getIssue();

    const baseLabels: string[] = issue.labels.map(({ name }) => name);
    const removeLabels = baseLabels.filter(name => labels.includes(name));

    for (const label of removeLabels) {
      await octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: issueNumber,
        name: label,
      });
    }
  }

  public async setLabels(labels: string[]) {
    // https://github.com/octokit/rest.js/issues/34
    // - Probability to appear
    // - avoid use setLabels
    const issue = await this.getIssue();

    const baseLabels: string[] = issue.labels.map(({ name }: any) => name);
    const removeLabels = baseLabels.filter(name => !labels.includes(name));
    const addLabels = labels.filter(name => !baseLabels.includes(name));

    if (removeLabels.length) {
      await this.removeLabels(removeLabels);
    }

    if (addLabels.length) {
      await this.addLabels(addLabels);
    }
  }

  public async unlockIssue() {
    const { owner, repo, octokit, issueNumber } = this;
    await octokit.issues.unlock({
      owner,
      repo,
      issue_number: issueNumber,
    });
  }

  public async updateComment(commentId: number, body: string, mode: TUpdateMode) {
    const { owner, repo, octokit } = this;
    const comment = await octokit.issues.getComment({
      owner,
      repo,
      comment_id: commentId,
    });
    const baseBody = comment.data.body;
    const newBody = body ? (mode === 'append' ? `${baseBody}\n${body}` : body) : baseBody;

    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body: newBody || '',
    });
  }

  public async updateIssue(
    state: TIssueState,
    title: string | void,
    body: string | void,
    mode: TUpdateMode,
    labels?: string[] | void,
    assignees?: string[] | void,
  ) {
    const { owner, repo, octokit, issueNumber } = this;
    const issue = await this.getIssue();
    const {
      body: baseBody,
      title: baseTitle,
      labels: baseLabels,
      assignees: baseAssigness,
      state: baseState,
    } = issue;

    const baseLabelsName = baseLabels.map(({ name }) => name);
    const baseAssignessName = baseAssigness?.map(({ login }) => login);

    const newBody = body ? (mode === 'append' ? `${baseBody}\n${body}` : body) : baseBody;

    if (labels && labels.length) {
      for (const label of labels) {
        if (baseLabelsName && baseLabelsName.length && baseLabelsName.indexOf(label) < 0) {
          await this.createLabel(label);
        }
      }
    }

    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: state || baseState,
      title: title || baseTitle,
      body: newBody,
      labels: labels?.length ? labels : baseLabelsName,
      assignees: assignees?.length ? assignees : baseAssignessName,
    });
  }
}
