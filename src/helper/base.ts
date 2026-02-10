import { dealStringToArr } from 'actions-util';

import { ELockReasons } from '../const';
import * as core from '../core';
import type { IIssueCoreEngine } from '../types';
import type { TCloseReason, TEmoji, TIssueState, TLockReasons, TUpdateMode } from '../types';

let ICE: IIssueCoreEngine;
export function initBaseICE(_ICE: IIssueCoreEngine) {
  ICE = _ICE;
}

export async function doAddAssignees(assignees: string[]) {
  await ICE.addAssignees(assignees);
  core.info(`[doAddAssignees] [${assignees}] success!`);
}

export async function doAddLabels(labels: string[], issueNumber?: number) {
  if (issueNumber) ICE.setIssueNumber(issueNumber);
  await ICE.addLabels(labels);
  core.info(`[doAddLabels] [${labels}] success!`);
}

export async function doCloseIssue(reason: TCloseReason, issueNumber?: number) {
  if (issueNumber) ICE.setIssueNumber(issueNumber);
  await ICE.closeIssue(reason);
  core.info(`[doCloseIssue] success!`);
}

export async function doCreateComment(body: string, emoji?: string, issueNumber?: number) {
  if (body) {
    if (issueNumber) ICE.setIssueNumber(issueNumber);
    const commentId = await ICE.createComment(body);
    core.info(`[doCreateComment] [${body}] success!`);
    core.setOutput('comment-id', commentId);
    if (emoji) {
      await doCreateCommentEmoji(commentId, emoji);
    }
  } else {
    core.warning(`[doCreateComment] body is empty!`);
  }
}

export async function doCreateCommentEmoji(_commentId: number | void, emoji: string) {
  const commentId = _commentId || core.getInput('comment-id');
  if (emoji && commentId) {
    await ICE.createCommentEmoji(+commentId, dealStringToArr(emoji) as TEmoji[]);
    core.info(`[doCreateCommentEmoji] [${emoji}] success!`);
  } else {
    core.warning(`[doCreateCommentEmoji] emoji or commentId is empty!`);
  }
}

export async function doCreateIssue(
  title: string,
  body: string,
  labels?: string[],
  assignees?: string[],
  emoji?: string | void,
) {
  if (title) {
    const issueNumber = await ICE.createIssue(title, body, labels, assignees);
    core.info(`[doCreateIssue] [${title}] success!`);
    core.setOutput('issue-number', issueNumber);
    if (emoji) {
      ICE.setIssueNumber(issueNumber);
      await ICE.createIssueEmoji(dealStringToArr(emoji) as TEmoji[]);
      core.info(`[createIssueEmoji] [${emoji}] success!`);
    }
  } else {
    core.warning(`[doCreateIssue] title is empty!`);
  }
}

export async function doCreateLabel() {
  const name = core.getInput('label-name');
  const color = core.getInput('label-color');
  const description = core.getInput('label-desc');

  if (name) {
    await ICE.createLabel(name, color, description);
    core.info(`[doCreateLabel] [${name}] success!`);
  } else {
    core.warning(`[doCreateLabel] label-name is empty!`);
  }
}

export async function doDeleteComment(_commentId: number | void) {
  const commentId = _commentId || core.getInput('comment-id');
  if (commentId) {
    await ICE.deleteComment(+commentId);
    core.info(`[doDeleteComment] [${commentId}] success!`);
  } else {
    core.warning(`[doDeleteComment] commentId is empty!`);
  }
}

export async function doGetIssue() {
  const { number, title, body, state, labels, assignees } = await ICE.getIssue();
  core.setOutput('issue-number', number);
  core.setOutput('issue-title', title || '');
  core.setOutput('issue-body', body || '');
  core.setOutput('issue-state', state);
  const labelsString = labels.length ? labels.map(({ name }) => name).join(',') : '';
  core.setOutput('issue-labels', labelsString);
  const assigneesString = assignees.length ? assignees.map(({ login }) => login).join(',') : '';
  core.setOutput('issue-assignees', assigneesString);
}

export async function doLockIssue(issueNumber?: number) {
  if (issueNumber) ICE.setIssueNumber(issueNumber);
  const lockReason = (core.getInput('lock-reason') || '') as TLockReasons;
  if (lockReason && !ELockReasons[lockReason]) {
    core.warning(`[doLockIssue] lock-reason is illegal!`);
    return;
  }
  await ICE.lockIssue(lockReason as TLockReasons);
  core.info(`[doLockIssue] success!`);
}

export async function doOpenIssue() {
  await ICE.openIssue();
  core.info(`[doOpenIssue] success!`);
}

export async function doRemoveAssignees(assignees: string[]) {
  await ICE.removeAssignees(assignees);
  core.info(`[doRemoveAssignees] [${assignees}] success!`);
}

export async function doRemoveLabels(labels: string[]) {
  await ICE.removeLabels(labels);
  core.info(`[doRemoveLabels] [${labels}] success!`);
}

export async function doSetLabels(labels: string[]) {
  await ICE.setLabels(labels);
  core.info(`[doSetLabels] [${labels}] success!`);
}

export async function doUnlockIssue() {
  await ICE.unlockIssue();
  core.info(`[doUnlockIssue] success!`);
}

export async function doUpdateComment(
  _commentId: number | void,
  body: string,
  updateMode: TUpdateMode,
  emoji: string | void,
) {
  const commentId = _commentId || core.getInput('comment-id');
  if (commentId) {
    await ICE.updateComment(+commentId, body, updateMode);
    core.info(`[doUpdateComment] [${commentId}] success!`);
    if (emoji) {
      await doCreateCommentEmoji(+commentId, emoji);
    }
  } else {
    core.warning(`[doUpdateComment] commentId is empty!`);
  }
}

export async function doUpdateIssue(
  issueNumber: number,
  state: TIssueState,
  title: string | void,
  body: string | void,
  updateMode: TUpdateMode,
  labels?: string[] | void,
  assignees?: string[] | void,
) {
  if (issueNumber) ICE.setIssueNumber(issueNumber);
  await ICE.updateIssue(state, title, body, updateMode, labels, assignees);
  core.info(`[doUpdateIssue] success!`);
}
