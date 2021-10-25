import * as core from '@actions/core';

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

export const getInput = (key: string): string | void => {
  core.getInput(key);
}

export const setOutput = (key: string, value: string | number | object | void ) => {
  let formatValue: string | number | object | void;
  if (value || typeof(value) === 'boolean') {
    if (typeof(value) === 'object') {
      formatValue = JSON.stringify(value);
    } else {
      formatValue = value;
    }
    core.setOutput(key, formatValue);
  }
}

export const setFailed = (mess: string) => {
  core.setFailed(`[🚨 AC] ${mess}`);
}
