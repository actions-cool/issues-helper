import type { TAction } from './default';

export interface IIssueHelperEngine {
  doExeAction: (action: TAction) => Promise<void>;
}
