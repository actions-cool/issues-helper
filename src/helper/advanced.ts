import type { TPermissionType } from 'actions-util';
import { checkPermission, dealStringToArr } from 'actions-util';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';

import * as core from '../core';
import type { IIssueCoreEngine, IListIssuesParams, TCommentInfo, TIssueList } from '../issue';
import type { TEmoji, TIssueState, TOutList } from '../types';
import { checkDuplicate, matchKeyword, replaceStr2Arr } from '../util';
import {
  doAddAssignees,
  doAddLabels,
  doCloseIssue,
  doCreateComment,
  doCreateCommentEmoji,
  doLockIssue,
  doSetLabels,
  doUpdateComment,
} from './base';

let ICE: IIssueCoreEngine;
export function initAdvancedICE(_ICE: IIssueCoreEngine) {
  ICE = _ICE;
}

export async function doQueryIssues(
  state: TIssueState | 'all',
  creator?: string,
  ignoreLabels?: boolean,
): Promise<TIssueList> {
  const params = {
    state,
  } as IListIssuesParams;

  const issueCreator = core.getInput('issue-creator');
  const issueAssignee = core.getInput('issue-assignee');
  const issueMentioned = core.getInput('issue-mentioned');

  if (issueCreator) params.creator = issueCreator;
  if (issueAssignee) params.assignee = issueAssignee;
  if (issueMentioned) params.mentioned = issueMentioned;

  const labels = core.getInput('labels');

  if (labels && !ignoreLabels) params.labels = labels;

  if (creator) params.creator = creator;

  const issuesList = await ICE.listIssues(params);
  const issues: TIssueList = [];
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

  core.info(`[doQueryIssues] issueNumbers is ---> ${JSON.stringify(issueNumbers)}`);
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
      const labelNames = labels.map(({ name }) => name);
      if (!labelNames.includes(inactiveLabel)) {
        core.info(`[doCheckInactive] Doing ---> ${number}`);
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

/**
 * 检查 issue 是否满足条件，满足返回 true
 * 当前 issue 的指定人是否有一个满足 assigneeIncludes 里的某个
 * 关键字匹配，是否包含前一个某个+后一个某个 '官网,网站/挂了,无法访问'
 */
export async function doCheckIssue() {
  let checkResult = true;

  const issue = await ICE.getIssue();
  const assigneeIncludes = core.getInput('assignee-includes');

  if (assigneeIncludes) {
    const assigneesCheck = dealStringToArr(assigneeIncludes);
    let checkAssignee = false;
    issue.assignees.forEach(it => {
      if (checkResult && !checkAssignee && assigneesCheck.includes(it.login)) {
        checkResult = true;
        checkAssignee = true;
      }
    });
    if (!checkAssignee) checkResult = false;
  }

  const titleRemove = core.getInput('title-excludes');
  if (!!checkResult && titleRemove) {
    const removes = dealStringToArr(titleRemove);
    let t = issue.title;
    removes.forEach(re => {
      t = t.replace(re, '');
    });
    if (t.trim().length == 0) {
      checkResult = false;
    }
  }

  const titleIncludes = core.getInput('title-includes');
  if (!!checkResult && titleIncludes) {
    const titleArr = titleIncludes.split('/');
    const keyword1 = dealStringToArr(titleArr[0]);
    const keyword2 = dealStringToArr(titleArr[1]);
    checkResult = keyword2.length
      ? matchKeyword(issue.title, keyword1) && matchKeyword(issue.title, keyword2)
      : matchKeyword(issue.title, keyword1);
  }

  const bodyIncludes = core.getInput('body-includes');
  if (!!checkResult && bodyIncludes) {
    const bodyArr = bodyIncludes.split('/');
    const keyword1 = dealStringToArr(bodyArr[0]);
    const keyword2 = dealStringToArr(bodyArr[1]);
    checkResult = keyword2.length
      ? matchKeyword(issue.body, keyword1) && matchKeyword(issue.body, keyword2)
      : matchKeyword(issue.body, keyword1);
  }

  core.info(`[doCheckIssue] result is [${checkResult}]`);
  core.setOutput('check-result', checkResult);
}

export async function doCloseIssues(body: string, emoji?: string) {
  const issues = await doQueryIssues('open');
  if (issues.length) {
    for (const { number } of issues) {
      core.info(`[doCloseIssues] Doing ---> ${number}`);
      if (body) await doCreateComment(body, emoji, number);
      await doCloseIssue(number);
    }
  } else {
    core.info(`[doCloseIssues] Query issues empty!`);
  }
}

export async function doFindComments() {
  const commentList = await ICE.listComments();
  core.info(`[doFindComments] success!`);

  const comments: TOutList = [];

  if (commentList.length) {
    const commentAuth = core.getInput('comment-auth');
    const bodyIncludes = core.getInput('body-includes');
    const direction = core.getInput('direction') === 'desc' ? 'desc' : 'asc';
    for (const comment of commentList) {
      const checkUser = commentAuth ? comment.user.login === commentAuth : true;
      const checkBody = bodyIncludes ? comment.body.includes(bodyIncludes) : true;
      if (checkUser && checkBody) {
        comments.push({
          id: comment.id,
          auth: comment.user.login,
          body: comment.body,
          created: comment.created_at,
          updated: comment.updated_at,
        });
      }
    }
    if (direction === 'desc') {
      comments.reverse();
    }
    core.setOutput('comments', JSON.stringify(comments));
    core.info(`[doFindComments] comments --> ${JSON.stringify(comments)}`);
  } else {
    core.info(`[doFindComments] Query comments empty!`);
  }
}

export async function doFindIssues() {
  let issueState = core.getInput('issue-state');
  if (issueState !== 'all' && issueState !== 'closed') {
    issueState = 'open';
  }
  const issueList = await doQueryIssues(issueState as TIssueState | 'all');
  let issues: TOutList = [];
  if (issueList.length) {
    const direction = core.getInput('direction') === 'desc' ? 'desc' : 'asc';
    issues = issueList.map(issue => {
      return {
        auth: issue.user.login,
        number: issue.number,
        title: issue.title,
        body: issue.body,
        state: issue.state,
        created: issue.created_at,
        updated: issue.updated_at,
      };
    });
    if (direction === 'desc') {
      issues.reverse();
    }
    core.info(`[doFindIssues] issues --> ${JSON.stringify(issues)}`);
  } else {
    core.info(`[doFindIssues] Query issues empty!`);
  }
  core.setOutput('issues', JSON.stringify(issues));
}

export async function doLockIssues(body: string, emoji?: string) {
  let issueState = core.getInput('issue-state');
  if (issueState !== 'all' && issueState !== 'closed') {
    issueState = 'open';
  }
  const issues = await doQueryIssues(issueState as TIssueState | 'all');

  if (issues.length) {
    for (const { number } of issues) {
      core.info(`[doLockIssues] Doing ---> ${number}`);
      if (body) await doCreateComment(body, emoji, number);
      await doLockIssue(number);
    }
  } else {
    core.info(`[doLockIssues] Query issues empty!`);
  }
}

export async function doMarkAssignees(comment: TCommentInfo) {
  const assignCommand = core.getInput('assign-command') || '/assign';
  if (comment.body.startsWith(assignCommand)) {
    const { body, user } = comment;
    const assigns = replaceStr2Arr(body, assignCommand, '@');
    const requirePermission = core.getInput('require-permission') || 'write';
    const permission = await ICE.getUserPermission(user.login);
    if (!checkPermission(requirePermission as TPermissionType, permission)) {
      core.info(`[doMarkAssignees] The user ${user.login} is not allow!`);
      return;
    }
    await doAddAssignees(assigns);
    core.info(`[doMarkAssignees] Done!`);
  } else {
    core.info(`[doMarkAssignees] The issues ignore!`);
  }
}

export async function doMarkDuplicate(
  comment: TCommentInfo,
  labels?: string[] | void,
  emoji?: string,
) {
  const duplicateCommand = core.getInput('duplicate-command');
  const duplicateLabels = core.getInput('duplicate-labels');
  const removeLables = core.getInput('remove-labels') || '';
  const closeIssue = core.getInput('close-issue');
  const requirePermission = core.getInput('require-permission') || 'write';

  const commentId = comment.id;
  const commentBody = comment.body;
  const commentUser = comment.user.login;

  const ifCommandInput = !!duplicateCommand;

  if (
    !commentBody.includes('?') &&
    ((ifCommandInput &&
      commentBody.startsWith(duplicateCommand) &&
      commentBody.split(' ')[0] == duplicateCommand) ||
      checkDuplicate(commentBody))
  ) {
    const permission = await ICE.getUserPermission(commentUser);
    if (!checkPermission(requirePermission as TPermissionType, permission)) {
      core.info(`[doMarkDuplicate] The user ${commentUser} is not allow!`);
      return;
    }

    if (ifCommandInput) {
      const nextBody = commentBody.replace(duplicateCommand, 'Duplicate of');
      await doUpdateComment(commentId, nextBody, 'replace', emoji);
    } else if (emoji) {
      await doCreateCommentEmoji(commentId, emoji);
    }

    const issue = await ICE.getIssue();
    let newLabels: string[] = [];
    if (issue.labels.length > 0) {
      newLabels = issue.labels
        .map(({ name }) => name)
        .filter(name => !dealStringToArr(removeLables).includes(name));
    }
    if (duplicateLabels) {
      newLabels = [...newLabels, ...dealStringToArr(duplicateLabels)];
    }
    if (labels) {
      newLabels = [...labels];
    }
    if (newLabels.length > 0) {
      await doSetLabels(newLabels);
    }
    if (closeIssue === 'true') {
      await doCloseIssue();
    }
    core.info(`[doMarkDuplicate] Done!`);
  } else {
    core.warning(
      `This comment body should start with 'duplicate-command' or 'Duplicate of' and not include '?'`,
    );
  }
}

export async function doWelcome(
  auth: string,
  issueNumber: number,
  body: string,
  labels?: string[] | void,
  assignees?: string[] | void,
  emoji?: string,
) {
  core.info(`[doWelcome] [${auth}]`);
  const issues = await doQueryIssues('all', auth, true);
  if (issues.length == 0 || (issues.length == 1 && issues[0].number == issueNumber)) {
    if (body) {
      await doCreateComment(body, emoji);
    }

    if (assignees?.length) {
      await doAddAssignees(assignees);
    }

    if (labels?.length) {
      await doAddLabels(labels);
    }

    const issueEmoji = core.getInput('issue-emoji');
    if (issueEmoji) {
      await ICE.createIssueEmoji(dealStringToArr(issueEmoji) as TEmoji[]);
    }
  } else {
    core.info(`[doWelcome] ${auth} is not first time!`);
  }
}
