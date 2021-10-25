import { TEmoji, TLockReasons } from '../types';

export interface IIssueBaseInfo {
  owner: string;
  repo: string;
  issueNunber: string;
  githubToken: string;
}

export type TUpdateMode = 'append' | string | undefined;

export interface IIssueCoreEngine {
  addAssignees(assignees: string[]): void;
  addLabels(labels: string[]): void;

  closeIssue(): void;
  /**
   * @param body The comment body.
   * @returns The create new comment id.
   */
  createComment(body: string): Promise<number>;
  createCommentEmoji(commentId: number, emoji: TEmoji[]): void;
  /**
   * @param title
   * @param body
   * @param labels
   * @param assignees
   * @returns The create new issue number.
   */
  createIssue(title: string, body: string | undefined, labels: string[], assignees: string[]): Promise<number>;
  createIssueEmoji(emoji: TEmoji[]): void;
  createLabel(labelName: string, labelColor: string, labelDescription: string | undefined): void;

  deleteComment(commentId: number): void;

  lockIssue(lockReason: TLockReasons): void;

  openIssue(): void;

  removeAssignees(assignees: string[]): void;
  removeLabels(labels: string[]): void;

  setLabels(labels: string[]): void;

  unlockIssue(): void;

  updateComment(commentId: number, body: string, mode: TUpdateMode): void;
  updateIssue(state: 'open' | 'closed', title: string | undefined, body: string | undefined, mode: TUpdateMode, labels: string[], assignees: string[]): void;
}
