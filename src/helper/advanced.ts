import { dealStringToArr } from 'actions-util';
import * as core from '../core';
import { TIssueState, TUpdateMode, TEmoji, TLockReasons } from '../types';
import { ELockReasons } from '../shared';
import { IIssueCoreEngine } from '../issue';

let ICE: IIssueCoreEngine;

export function initAdvancedICE(_ICE: IIssueCoreEngine) {
  ICE = _ICE;
}

export async function doCheckInactive() {

}
