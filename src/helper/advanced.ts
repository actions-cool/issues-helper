import { dealStringToArr } from 'actions-util';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as core from '../core';
import { TIssueState, TUpdateMode, TEmoji, TLockReasons } from '../types';
import { ELockReasons } from '../shared';
import { IIssueCoreEngine, IListIssuesParams, TListIssuesResults } from '../issue';
import {
  doAddLabels,
  doCreateComment,
} from './base';

let ICE: IIssueCoreEngine;
export function initAdvancedICE(_ICE: IIssueCoreEngine) {
  ICE = _ICE;
}

export async function doQueryIssues(state: TIssueState | 'all', creator?: string): Promise<TListIssuesResults> {
  const params = {
    state,
  } as IListIssuesParams;

  const issueCreator = core.getInput('issue-creator');
  const issueAssignee = core.getInput('issue-assignee');
  const issueMentioned = core.getInput('issue-mentioned');
  issueCreator ? (params.creator = issueCreator) : null;
  issueAssignee ? (params.assignee = issueAssignee) : null;
  issueMentioned ? (params.mentioned = issueMentioned) : null;

  const labels = core.getInput('labels');
  labels ? params.labels = labels : null;

  creator? params.creator = creator : null;

  const issuesList = await ICE.listIssues(params);
  const issues: TListIssuesResults = [];
  const issueNumbers: number[] = [];

  if (issuesList.length) {
    const excludeLabels = core.getInput('exclude-labels') || '';
    const bodyIncludes = core.getInput('body-includes');
    const titleIncludes = core.getInput('title-includes');

    const excludeLabelsArr = dealStringToArr(excludeLabels);
    issuesList.forEach(issue => {
      const bodyCheck = bodyIncludes ? issue.body.includes(bodyIncludes) : true;
      const titleCheck = titleIncludes ? issue.title.includes(titleIncludes) : true;
      /**
       * Note: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request.
       * For this reason, "Issues" endpoints may return both issues and pull requests in the response.
       * You can identify pull requests by the pull_request key.
       */
      if (bodyCheck && titleCheck && issue.pull_request === undefined) {
        if (excludeLabelsArr.length) {
          for (let i = 0; i < issue.labels.length; i += 1) {
            if (excludeLabelsArr.includes(issue.labels[i].name)) return;
          }
        }

        const inactiveDay = core.getInput('inactive-day');
        if (inactiveDay) {
          dayjs.extend(utc);
          dayjs.extend(isSameOrBefore);

          const lastTime = dayjs.utc().subtract(+inactiveDay, 'day');
          const updateTime = dayjs.utc(issue.updated_at);
          if (updateTime.isSameOrBefore(lastTime)) {
            issues.push(issue);
            issueNumbers.push(issue.number);
          }
        } else {
          issues.push(issue);
          issueNumbers.push(issue.number);
        }
      }
    });
  }

  core.info(`[doQueryIssues] issueNumbers is [${JSON.stringify(issueNumbers)}]`);
  return issues;
}

export async function doCheckInactive(body: string, emoji?: string) {
  let issueState = core.getInput('issue-state');
  if (issueState !== 'all' && issueState !== 'closed') {
    issueState = 'open';
  }
  const issues = await doQueryIssues(issueState as TIssueState | 'all');
  if (issues.length) {
    const inactiveLabel = core.getInput('inactive-label') || 'inactive';
    for (const issue of issues) {
      const { labels, number } = issue;
      const labelNames = labels.map(({name}) => name);
      if (!labelNames.includes(inactiveLabel)) {
        await doAddLabels([inactiveLabel], number);
        if (body) await doCreateComment(body, emoji, number);
      } else {
        core.info(`[doCheckInactive] The issue ${number} already has ${inactiveLabel} label!`);
      }
    }
  } else {
    core.info(`[doCheckInactive] Query issues empty!`);
  }
}
