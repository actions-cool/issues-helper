import { TEmoji, TLockReasons, TIssueState, TUpdateMode } from '../types';

export interface IIssueBaseInfo {
  owner: string;
  repo: string;
  issueNumber: number;
  githubToken: string;
}

export interface IListIssuesParams {
  owner: string;
  repo: string;
  state: 'all' | 'open' | 'closed';


}

export interface IIssueCoreEngine {
  setIssueNumber(newIssueNumber: number): void;
  addAssignees(assignees: string[]): Promise<void>;
  addLabels(labels: string[]): Promise<void>;

  closeIssue(): Promise<void>;
  /**
   * @param body The comment body.
   * @returns The create new comment id.
   */
  createComment(body: string): Promise<number>;
  createCommentEmoji(commentId: number, emoji: TEmoji[]): Promise<void>;
  /**
   * @param title
   * @param body
   * @param labels
   * @param assignees
   * @returns The create new issue number.
   */
  createIssue(title: string, body: string, labels: string[] | void, assignees: string[] | void): Promise<number>;
  createIssueEmoji(emoji: TEmoji[]): Promise<void>;
  createLabel(labelName: string, labelColor: string, labelDescription: string | undefined): Promise<void>;

  deleteComment(commentId: number): Promise<void>;

  lockIssue(lockReason: TLockReasons): Promise<void>;

  openIssue(): Promise<void>;

  removeAssignees(assignees: string[]): Promise<void>;
  removeLabels(labels: string[]): Promise<void>;

  setLabels(labels: string[]): Promise<void>;

  unlockIssue(): Promise<void>;

  updateComment(commentId: number, body: string, mode: TUpdateMode): Promise<void>;
  updateIssue(state: TIssueState, title: string | void, body: string | void, mode: TUpdateMode, labels?: string[] | void, assignees?: string[] | void): Promise<void>;
}
