import * as core from '@actions/core';

export const baseInfo = (mess: string) => {
  core.info(mess);
}

export const info = (mess: string) => {
  core.info(`[📝 AC] ${mess}`);
}

export const error = (mess: string) => {
  core.error(`[💥 AC] ${mess}`);
}

export const notice = (mess: string) => {
  core.notice(`[🏷 AC] ${mess}`);
}

export const warning = (mess: string) => {
  core.warning(`[🎃 AC] ${mess}`);
}

export const getInput = (key: string, options?: core.InputOptions): string | void => {
  core.getInput(key, options);
}

export const setOutput = (key: string, value: string | boolean | number | object ) => {
  let formatValue: string | number | boolean | object;
  if (typeof(value) === 'object') {
    formatValue = JSON.stringify(value);
  } else {
    formatValue = value;
  }
  core.setOutput(key, formatValue);
}

export const setFailed = (mess: string) => {
  core.setFailed(`[🚨 AC] ${mess}`);
}
