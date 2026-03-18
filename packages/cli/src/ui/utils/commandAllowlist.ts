/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCommandRoots } from '@google/gemini-cli-core';

export const SafeCommandAllowlist = new Set([
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

export const EditCommandAllowlist = new Set([
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
    if (SafeCommandAllowlist.has(baseCmd)) {
      return true;
    }
    if (isAcceptEdits && EditCommandAllowlist.has(baseCmd)) {
      return true;
    }
    return false;
  });
}
