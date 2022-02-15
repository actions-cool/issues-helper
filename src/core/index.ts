import * as core from '@actions/core';

export const baseInfo = (mess: string) => {
  core.info(mess);
};

export const info = (mess: string) => {
  core.info(`[📝 AC] ${mess}`);
};

export const error = (mess: string) => {
  core.error(`[💥 AC] ${mess}`);
};

export const notice = (mess: string) => {
  core.notice(`[🏷 AC] ${mess}`);
};

export const warning = (mess: string) => {
  core.warning(`[🎃 AC] ${mess}`);
};

export const getInput = core.getInput;

export const setOutput = core.setOutput;

export const setFailed = (mess: string) => {
  core.setFailed(`[🚨 AC] ${mess}`);
};
