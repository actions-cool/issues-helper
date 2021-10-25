import { Octokit } from '@octokit/rest';

import * as core from '../core';

import { TEmoji, TLockReasons } from '../types';
import { IIssueBaseInfo, IIssueCoreEngine, TUpdateMode } from './types';

export class IssueCoreEngine implements IIssueCoreEngine {
  private owner!: string;
  private repo!: string;
  private issueNumber!: number;
  private githubToken!: string;

  private octokit!: Octokit;

  public constructor(private _info: IIssueBaseInfo) {
    if (_info.owner && _info.repo && _info.githubToken) {
      Object.assign(this, _info);
      const octokit = new Octokit({ auth: `token ${this.githubToken}` });
      this.octokit = octokit;
    } else {
      core.error(`Init failed, need owner、repo and token!`);
    }
  }

  // Allow modify issue number in this way
  public setIssueNumber(newIssueNumber: number) {
    this.issueNumber = newIssueNumber;
  }

  public async addAssignees(assignees: string[]) {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.addAssignees({
      owner,
      repo,
      issue_number: issueNumber,
      assignees,
    });
  }

  public async addLabels(labels: string[]) {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: labels,
    });
  }

  public async closeIssue() {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    });
  }

  public async createComment(body: string): Promise<number> {
    const {owner, repo, octokit, issueNumber } = this;
    const { data } = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });
    core.setOutput('comment-id', data.id);
    return data.id;
  }

  public async createCommentEmoji(commentId: number, emoji: TEmoji[]) {
    const {owner, repo, octokit } = this;
    for (const content of emoji) {
      await octokit.reactions.createForIssueComment({
        owner,
        repo,
        comment_id: commentId,
        content,
      });
      core.info(`[create-comment-emoji] [${content}] success!`);
    }
  }

  public async createIssue(title: string, body: string | undefined, labels: string[], assignees: string[]): Promise<number> {
    const {owner, repo, octokit } = this;
    const { data } = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
    });
    core.setOutput('issue-number', data.number);
    return data.number;
  }

  public async createIssueEmoji(emoji: TEmoji[]) {
    const {owner, repo, octokit, issueNumber } = this;
    for (const content of emoji) {
      await octokit.reactions.createForIssue({
        owner,
        repo,
        issue_number: issueNumber,
        content,
      });
      core.info(`[create-issue-emoji] [${content}] success!`);
    }
  }

  public async createLabel(labelName: string, labelColor: string, labelDescription: string | undefined) {
    const {owner, repo, octokit } = this;
    await octokit.issues.createLabel({
      owner,
      repo,
      name: labelName,
      color: labelColor,
      description: labelDescription,
    });
  }

  public async deleteComment(commentId: number) {
    const {owner, repo, octokit } = this;
    await octokit.issues.deleteComment({
      owner,
      repo,
      comment_id: commentId,
    });
  }

  public async lockIssue(lockReason: TLockReasons) {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.lock({
      owner,
      repo,
      issue_number: issueNumber,
      lockReason,
    });
  }

  public async openIssue() {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'open',
    });
  }

  public async removeAssignees(assignees: string[]) {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.removeAssignees({
      owner,
      repo,
      issue_number: issueNumber,
      assignees,
    });
  }

  public async removeLabels(labels: string[]) {
    const {owner, repo, octokit, issueNumber } = this;
    const issue = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    const baseLabels = issue.data.labels.map(({ name }: any) => name);
    const removeLabels = baseLabels.filter(name => labels.includes(name));

    core.info(`[filter-labels] [${removeLabels.join(',')}]!`);

    for (const label of removeLabels) {
      await octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: issueNumber,
        name: label,
      });
      core.info(`[remove-label] [${label}] success!`);
    }
  }

  public async setLabels(labels: string[]) {
    // https://github.com/octokit/rest.js/issues/34
    // - Probability to appear
    // - avoid use setLabels
    const {owner, repo, octokit, issueNumber } = this;

    const issue = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    const baseLabels = issue.data.labels.map(({ name }: any) => name);
    const removeLabels = baseLabels.filter(name => !labels.includes(name));
    const addLabels = labels.filter(name => !baseLabels.includes(name));

    if (removeLabels.length) {
      core.info(`[filter-remove-labels] [${removeLabels.join(',')}]!`);
      await this.removeLabels(removeLabels);
    }

    if (addLabels.length) {
      core.info(`[filter-add-labels] [${addLabels.join(',')}]!`);
      await this.addLabels(addLabels);
    }
  }

  public async unlockIssue() {
    const {owner, repo, octokit, issueNumber } = this;
    await octokit.issues.unlock({
      owner,
      repo,
      issue_number: issueNumber,
    });
  }

  public async updateComment(commentId: number, body: string, mode: TUpdateMode) {
    const {owner, repo, octokit } = this;
    const comment = await octokit.issues.getComment({
      owner,
      repo,
      comment_id: commentId,
    });
    const baseBody = comment.data.body;

    let newBody: string;
    if (mode === 'append') {
      newBody = `${baseBody}\n${body}`;
    } else {
      newBody = body;
    }

    await octokit.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body: newBody,
    });
  }

  public async updateIssue(state: 'open' | 'closed', title: string | undefined, body: string | undefined, mode: TUpdateMode, labels: string[], assignees: string[]) {
    const {owner, repo, octokit, issueNumber } = this;

    const issue = await octokit.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    const { body: baseBody, title: baseTitle, labels: baseLabels, assignees: baseAssigness, state: baseState } = issue.data;

    const baseLabelsName = baseLabels.map(({name}: any) => name);
    const baseAssignessName = baseLabels.map(({login}: any) => login);

    const newBody = body ? (mode === 'append' ? `${baseBody}\n${body}` : body) : baseBody;

    await octokit.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: state || baseState,
      title: title || baseTitle,
      body: newBody,
      labels: labels.length ? labels : baseLabelsName,
      assignees: assignees.length ? assignees : baseAssignessName,
    });
  }
}
