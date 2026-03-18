/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCommandRoots } from './shell-utils.js';

export const safeCommandAllowlist = new Set([
  'ls',
  'cat',
  'grep',
  'pwd',
  'find',
  'echo',
  'head',
  'tail',
  'less',
  'more',
  'whoami',
  'date',
  'cd',
  'clear',
  'history',
  'man',
  'awk',
  'sed',
  'sort',
  'uniq',
  'wc',
  'diff',
  'ping',
]);

export const editCommandAllowlist = new Set([
  'cp',
  'mv',
  'mkdir',
  'touch',
  'rmdir',
  'chmod',
  'chown',
  'tar',
  'gzip',
  'gunzip',
  'unzip',
  'zip',
]);

export function extractBaseCommands(command: string): string[] {
  return getCommandRoots(command);
}

export function canShowAutoApproveCheckbox(
  command: string,
  isAcceptEdits: boolean,
): boolean {
  const baseCommands = extractBaseCommands(command);

  if (baseCommands.length === 0) {
    return false;
  }

  return baseCommands.every((baseCmd) => {
    if (safeCommandAllowlist.has(baseCmd)) {
      return true;
    }
    if (isAcceptEdits && editCommandAllowlist.has(baseCmd)) {
      return true;
    }
    return false;
  });
}
