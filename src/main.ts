import * as github from '@actions/github';
import { dealStringToArr, THANKS } from 'actions-util';

import * as core from './core';
import { IssueHelperEngine } from './helper';
import type { TAction } from './types';

async function main() {
  try {
    const actions = core.getInput('actions', { required: true });
    const IHE = new IssueHelperEngine(github.context);
    for (const action of dealStringToArr(actions)) {
      await IHE.doExeAction(action as TAction);
    }
    core.baseInfo(`\n${THANKS}`);
  } catch (err: any) {
    core.setFailed(err.message);
  }
}

main();
