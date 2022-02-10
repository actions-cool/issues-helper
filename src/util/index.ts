import { dealStringToArr } from 'actions-util';
import sampleSize from 'lodash/sampleSize';

export const dealRandomAssignees = (assignees: string, randomTo: string | void): string[] => {
  let arr = dealStringToArr(assignees);
  if (randomTo && Number(randomTo) > 0 && Number(randomTo) < arr.length) {
    arr = sampleSize(arr, Number(randomTo));
  }
  return arr;
};

export const matchKeyword = (content: string, keywords: string[]): boolean => {
  return !!keywords.find(item => content.toLowerCase().includes(item));
};

export const checkDuplicate = (body: string | void): boolean => {
  if (!body || !body.startsWith('Duplicate of')) {
    return false;
  }
  const arr = body.split(' ');
  return arr[0] == 'Duplicate' && arr[1] == 'of';
};

export const getPreMonth = (m: number): number => {
  return m == 1 ? 12 : m - 1;
};

// replace some & split & cull empty
export const replaceStr2Arr = (str: string, replace: string, split: string): string[] => {
  return str
    .replace(replace, '')
    .trim()
    .split(split)
    .reduce((result: string[], it) => (it ? [...result, it.trim()] : result), []);
};
