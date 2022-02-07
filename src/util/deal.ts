import sampleSize from 'lodash/sampleSize';
import { dealStringToArr } from 'actions-util';

export const dealRandomAssignees = (assignees: string, randomTo: string | void): string[] => {
  let arr = dealStringToArr(assignees);
  if (randomTo && Number(randomTo) > 0 && Number(randomTo) < arr.length) {
    arr = sampleSize(arr, Number(randomTo));
  }
  return arr;
}
