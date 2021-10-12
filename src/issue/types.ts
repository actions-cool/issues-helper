import { TEmoji, TLockReasons, TStringOrVoid } from '../types';

export interface IIssueBaseInfo {
  owner: string;
  repo: string;
  issueNunber: string | void;
  githubToken: string;
}

type updateMode = 'append' | string | void;

export interface IIssueCoreEngine {
  addAssignees(assignees: string[]): void;
  addLabels(labels: string[]): void;

  closeIssue(): void;
  /**
   * @param body The comment body.
   * @returns The create new comment id.
   */
  createComment(body: string): string;
  createCommentEmoji(emoji: TEmoji): void;
  /**
   * @param title
   * @param body
   * @param labels
   * @param assignees
   * @returns The create new issue number.
   */
  createIssue(title: string, body: TStringOrVoid, labels: string[], assignees: string[]): string;
  createIssueEmoji(emoji: TEmoji): void;
  createLabel(labelName: string, labelColor: string, labelDescription: TStringOrVoid): void;

  deleteComment(commentId: string): void;

  lockIssue(lockReason: TLockReasons): void;

  openIssue(): void;

  removeAssignees(assignees: string[]): void;
  removeLabels(labels: string[]): void;

  setLabels(labels: string[]): void;

  unlockIssue(): void;

  updateComment(commentId: string, body: TStringOrVoid, mode: updateMode): void;
}
