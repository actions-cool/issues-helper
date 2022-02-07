import sampleSize from 'lodash/sampleSize';
import { dealStringToArr } from 'actions-util';
export { dealStringToArr };

export const matchKeyword = (content: string, keywords: string[]): string | undefined => {
  return keywords.find(item => content.toLowerCase().includes(item));
}

export const testDuplicate = (body: string | void): boolean => {
  if (!body || !body.startsWith('Duplicate of')) {
    return false;
  }

  let arr = body.split(' ');
  if (arr[0] == 'Duplicate' && arr[1] == 'of') {
    return true;
  } else {
    return false;
  }
}

export const getPreMonth = (m: number): number => {
  return m == 1 ? 12 : m - 1;
}

export const checkPermission = (require: string, permission: string): boolean => {
  /**
   * 有权限返回 true
   */
  const permissions = ['none', 'read', 'write', 'admin'];
  const requireNo = permissions.indexOf(require);
  const permissionNo = permissions.indexOf(permission);

  return requireNo <= permissionNo;
}


