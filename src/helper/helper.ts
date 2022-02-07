// import * as github from '@actions/github';
import { dealStringToArr } from 'actions-util';
import * as core from '../core';
import { Context, TIssueState, TUpdateMode, TAction, TEmoji } from '../types';
import {
  IssueCoreEngine,
  IIssueCoreEngine,
} from '../issue';
import { dealRandomAssignees } from '../util';
import { IIssueHelperEngine } from './types';

import {
  initBaseICE,
  doAddAssignees,
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doCreateCommentEmoji,
  doCreateIssue,
  doCreateLabel,
  doDeleteComment,
  doLockIssue,
  doOpenIssue,
  doRemoveAssignees,
  doRemoveLabels,
  doSetLabels,
  doUnlockIssue,
  doUpdateComment,
  doUpdateIssue,
} from './base';

import {
  initAdvancedICE,
  doCheckInactive,
} from './advanced';

export class IssueHelperEngine implements IIssueHelperEngine {
  private ICE!: IIssueCoreEngine;

  private owner!: string;
  private repo!: string;
  private issueNumber!: number;
  private githubToken!: string;

  private emoji?: string;
  private labels?: string[] | void;
  private assignees?: string[] | void;
  private title: string = '';
  private body: string = '';
  private state: TIssueState = 'open';
  private updateMode: TUpdateMode = 'replace';

  public constructor(readonly ctx: Context) {
    this.initInput(ctx);
    this.initIssueCore();
    initBaseICE(this.ICE);
    initAdvancedICE(this.ICE);
  }

  private initInput(ctx: Context) {
    // No display to outside
    const repoInput = core.getInput('repo');
    if (repoInput) {
      this.owner = repoInput.split('/')[0];
      this.repo = repoInput.split('/')[1];
    } else {
      this.owner = ctx.repo.owner;
      this.repo = ctx.repo.repo;
    }

    let defaultCtxNumber: number | undefined;
    if (ctx.eventName === 'issues' || ctx.eventName === 'issue_comment') {
      defaultCtxNumber = ctx.payload.issue?.number;
    }
    const issueNumber = core.getInput('issue-number') || defaultCtxNumber;
    if (issueNumber) {
      this.issueNumber = +issueNumber;
    } else {
      core.setFailed(`issue-number is missing!`);
      return;
    }

    this.githubToken = core.getInput('token', { required: true }) as string;
    this.emoji = core.getInput('emoji') || '';
    this.labels = dealStringToArr(core.getInput('labels') || '');

    const assigneesInput = core.getInput('assignees') || '';
    const randomTo = core.getInput('random-to');
    this.assignees = dealRandomAssignees(assigneesInput, randomTo);

    this.title = core.getInput('title') || '';
    this.body = core.getInput('body') || '';
    this.state = core.getInput('state') === 'closed' ? 'closed' : 'open';
    this.updateMode = core.getInput('update-mode') === 'append' ? 'append' : 'replace';
  }

  private initIssueCore() {
    const { owner, repo, issueNumber, githubToken } = this;
    this.ICE = new IssueCoreEngine({
      owner,
      repo,
      issueNumber,
      githubToken,
    });
    core.info(`[Init] [${owner}/${repo}] [${issueNumber}]`);
  }

  public async doExeAction(action: TAction) {
    const { owner, repo, issueNumber, emoji, labels, assignees, title, body, updateMode, state } = this;
    switch (action) {
      // ---[ Base Begin ]--->>>
      case 'add-assignees': {
        if (assignees && assignees.length) {
          await doAddAssignees(assignees);
        } else {
          core.warning(`[doAddAssignees] assignees is empty!`);
        }
        break;
      }
      case 'add-labels': {
        if (labels && labels.length) {
          await doAddLabels(labels);
        } else {
          core.warning(`[doAddLabels] labels is empty!`);
        }
        break;
      }
      case 'close-issue': {
        await doCloseIssue(issueNumber);
        break;
      }
      case 'create-comment': {
        await doCreateComment(body, emoji);
        break;
      }
      case 'create-issue': {
        await doCreateIssue(title, body, labels, assignees, emoji);
        break;
      }
      case 'create-label': {
        await doCreateLabel();
        break;
      }
      case 'delete-comment': {
        await doDeleteComment();
        break;
      }
      case 'lock-issue': {
        await doLockIssue(issueNumber);
        break;
      }
      case 'open-issue': {
        await doOpenIssue(issueNumber);
        break;
      }
      case 'remove-assignees': {
        if (assignees && assignees.length) {
          await doRemoveAssignees(assignees);
        } else {
          core.warning(`[doRemoveAssignees] assignees is empty!`);
        }
        break;
      }
      case 'remove-labels': {
        if (labels && labels.length) {
          await doRemoveLabels(labels);
        } else {
          core.warning(`[doRemoveLabels] labels is empty!`);
        }
        break;
      }
      case 'set-labels': {
        if (labels && labels.length) {
          await doSetLabels(labels);
        } else {
          core.warning(`[doSetLabels] labels is empty!`);
        }
        break;
      }
      case 'unlock-issue': {
        await doUnlockIssue(issueNumber);
        break;
      }
      case 'update-comment': {
        await doUpdateComment(0, body, updateMode, emoji);
        break;
      }
      case 'update-issue': {
        await doUpdateIssue(issueNumber, state, title, body, updateMode, labels, assignees);
        break;
      }
      // ---[ Base End ]--->>>
      // ^_^ ============= ^_^
      // -[ Advanced Begin ]->
      case 'check-inactive': {
        await doCheckInactive();
        break;
      }
    }
  }
}
