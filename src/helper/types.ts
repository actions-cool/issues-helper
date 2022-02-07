import { TAction } from '../types';

export interface IIssueHelperEngine {
  doExeAction(action: TAction): Promise<void>;
}
