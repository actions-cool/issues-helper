import { dealStringToArr } from 'actions-util';

import * as core from '../core';
import { IssueCoreEngine } from '../issue';
import type {
  Context,
  IIssueCoreEngine,
  IIssueHelperEngine,
  TAction,
  TCloseReason,
  TCommentInfo,
  TIssueState,
  TUpdateMode,
} from '../types';
import { dealRandomAssignees } from '../util';
import {
  doCheckInactive,
  doCheckIssue,
  doCloseIssues,
  doFindComments,
  doFindIssues,
  doLockIssues,
  doMarkAssignees,
  doMarkDuplicate,
  doToggleLabels,
  doWelcome,
  initAdvancedICE,
} from './advanced';
import {
  doAddAssignees,
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doCreateIssue,
  doCreateLabel,
  doDeleteComment,
  doGetIssue,
  doLockIssue,
  doOpenIssue,
  doRemoveAssignees,
  doRemoveLabels,
  doSetLabels,
  doUnlockIssue,
  doUpdateComment,
  doUpdateIssue,
  initBaseICE,
} from './base';

export class IssueHelperEngine implements IIssueHelperEngine {
  private ICE!: IIssueCoreEngine;

  private owner!: string;
  private repo!: string;
  private issueNumber!: number;

  private emoji?: string;
  private labels?: string[];
  private assignees?: string[];
  private title: string = '';
  private body: string = '';
  private state: TIssueState = 'open';
  private updateMode: TUpdateMode = 'replace';
  private closeReason: TCloseReason = 'not_planned';

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
    }

    this.emoji = core.getInput('emoji') || '';
    this.labels = dealStringToArr(core.getInput('labels') || '');

    const assigneesInput = core.getInput('assignees') || '';
    const randomTo = core.getInput('random-to');
    this.assignees = dealRandomAssignees(assigneesInput, randomTo);

    this.title = core.getInput('title') || '';
    this.body = core.getInput('body') || '';
    this.state = core.getInput('state') === 'closed' ? 'closed' : 'open';
    this.updateMode = core.getInput('update-mode') === 'append' ? 'append' : 'replace';
    this.closeReason = core.getInput('close-reason') === 'completed' ? 'completed' : 'not_planned';
  }

  private initIssueCore() {
    const { owner, repo, issueNumber } = this;
    const token = core.getInput('token');
    this.ICE = new IssueCoreEngine({
      owner,
      repo,
      issueNumber,
      token,
    });
    core.info(`[Init] [${owner}/${repo} => ${issueNumber}]`);
  }

  public async doExeAction(action: TAction) {
    const {
      issueNumber,
      emoji,
      labels,
      assignees,
      title,
      body,
      updateMode,
      state,
      ctx,
      closeReason,
    } = this;
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
        await doCloseIssue(closeReason);
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
      case 'get-issue': {
        await doGetIssue();
        break;
      }
      case 'lock-issue': {
        await doLockIssue();
        break;
      }
      case 'open-issue': {
        await doOpenIssue();
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
        await doUnlockIssue();
        break;
      }
      case 'update-comment': {
        await doUpdateComment(0, body, updateMode, emoji);
        break;
      }
      case 'update-issue': {
        await doUpdateIssue(0, state, title, body, updateMode, labels, assignees);
        break;
      }
      // ---[ Base End ]--->>>
      // ^_^ ============= ^_^
      // -[ Advanced Begin ]->
      case 'check-inactive': {
        await doCheckInactive(body, emoji);
        break;
      }
      case 'check-issue': {
        await doCheckIssue();
        break;
      }
      case 'close-issues': {
        await doCloseIssues(body, closeReason, emoji);
        break;
      }
      case 'find-comments': {
        await doFindComments();
        break;
      }
      case 'find-issues': {
        await doFindIssues();
        break;
      }
      case 'lock-issues': {
        await doLockIssues(body, emoji);
        break;
      }
      case 'mark-assignees': {
        if (this.checkEvent4Mark()) {
          core.warning(`[mark-assignees] only support event '[issue_comment: created/edited]'!`);
          return;
        }
        await doMarkAssignees(ctx.payload.comment as TCommentInfo);
        break;
      }
      case 'mark-duplicate': {
        if (this.checkEvent4Mark()) {
          core.warning(`[mark-duplicate] only support event '[issue_comment: created/edited]'!`);
          return;
        }
        await doMarkDuplicate(ctx.payload.comment as TCommentInfo, closeReason, labels, emoji);
        break;
      }
      case 'toggle-labels': {
        await doToggleLabels(labels);
        break;
      }
      case 'welcome': {
        if (ctx.eventName === 'issues' && ctx.payload.action === 'opened') {
          await doWelcome(ctx.actor, issueNumber, body, labels, assignees, emoji);
        } else {
          core.warning('[welcome] only support issue opened!');
        }
        break;
      }
      // -[ Advanced End ]->
      default: {
        core.warning(`The ${action} is not allowed.`);
        break;
      }
    }
  }

  private checkEvent4Mark() {
    const { ctx } = this;
    return (
      ctx.eventName !== 'issue_comment' &&
      (ctx.payload.action === 'created' || ctx.payload.action === 'edited')
    );
  }
}
