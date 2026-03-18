/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { canShowAutoApproveCheckbox } from './commandAllowlist.js';
import * as shellUtils from './shell-utils.js';

// Mock getCommandRoots to test the logic directly without needing the wasm parser to be fully loaded
vi.mock('./shell-utils.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./shell-utils.js')>();
  return {
    ...actual,
    getCommandRoots: vi.fn(),
  };
});

describe('commandAllowlist', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('canShowAutoApproveCheckbox', () => {
    it('should return true for safe commands in default mode', () => {
      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['ls']);
      expect(canShowAutoApproveCheckbox('ls -la', false)).toBe(true);

      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['grep', 'cat']);
      expect(canShowAutoApproveCheckbox('cat file | grep "test"', false)).toBe(
        true,
      );
    });

    it('should return false for edit commands in default mode', () => {
      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['mkdir']);
      expect(canShowAutoApproveCheckbox('mkdir test', false)).toBe(false);

      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['touch']);
      expect(canShowAutoApproveCheckbox('touch file.txt', false)).toBe(false);
    });

    it('should return true for edit commands in accept-edits mode', () => {
      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['mkdir']);
      expect(canShowAutoApproveCheckbox('mkdir test', true)).toBe(true);

      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['touch']);
      expect(canShowAutoApproveCheckbox('touch file.txt', true)).toBe(true);
    });

    it('should return false for destructive commands in any mode', () => {
      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['rm']);
      expect(canShowAutoApproveCheckbox('rm -rf /', false)).toBe(false);
      expect(canShowAutoApproveCheckbox('rm -rf /', true)).toBe(false);

      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['mkfs']);
      expect(canShowAutoApproveCheckbox('mkfs.ext4 /dev/sda1', true)).toBe(
        false,
      );

      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['format']);
      expect(canShowAutoApproveCheckbox('format C:', true)).toBe(false);
    });

    it('should return false for pipelines where one command is destructive', () => {
      vi.mocked(shellUtils.getCommandRoots).mockReturnValue(['ls', 'rm']);
      expect(canShowAutoApproveCheckbox('ls | xargs rm', true)).toBe(false);
    });

    it('should return false if getCommandRoots returns empty (e.g., parsing failed or no command)', () => {
      vi.mocked(shellUtils.getCommandRoots).mockReturnValue([]);
      expect(canShowAutoApproveCheckbox('', true)).toBe(false);
    });
  });
});
