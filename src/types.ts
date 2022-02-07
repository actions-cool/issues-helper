export { Context } from '@actions/github/lib/context';

export type TEmoji = '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes';

export type TLockReasons = 'off-topic' | 'too heated' | 'resolved' | 'spam' | undefined;

export type TIssueState = 'open' | 'closed';

export type TUpdateMode = 'append' | 'replace';

export type TAction =
  // [ Base Begin ]
    'add-assignees'
  | 'add-labels'
  | 'close-issue'
  | 'create-comment'
  | 'create-issue'
  | 'create-label'
  | 'delete-comment'
  | 'lock-issue'
  | 'open-issue'
  | 'remove-assignees'
  | 'remove-labels'
  | 'set-labels'
  | 'unlock-issue'
  | 'update-comment'
  | 'update-issue'
  // [ Base End ]
  // ^_^ ========== ^_^
  // [ Advanced Begin ]
  | 'check-inactive'
  | 'check-issue'
  | 'close-issues'
  | 'find-comments'
  | 'find-issues'
  | 'lock-issues'
  | 'mark-assignees'
  | 'mark-duplicate'
  | 'month-statistics'
  | 'welcome';
  // [ Advanced End ]
