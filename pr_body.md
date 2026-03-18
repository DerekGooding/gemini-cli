## Summary

This PR maps the `--yolo` flag natively into a wildcard policy array
(`allowedTools: ["*"]`) and removes the concept of `ApprovalMode.YOLO` as a
distinct state in the application, fulfilling issue #11303.

## Details

This removes the hardcoded `ApprovalMode.YOLO` state and its associated
UI/bypasses. The `PolicyEngine` now evaluates YOLO purely via data-driven rules.

- Removes `ApprovalMode.YOLO`
- Removes UI toggle (`Ctrl+Y`) and indicators for YOLO
- Removes `yolo.toml`
- Updates A2A server and CLI config logic to translate YOLO into a wildcard tool
- Rewrote policy engine tests to evaluate the wildcard

## Related Issues

Fixes #11303

## How to Validate

1. Run `npm run start -- --yolo`
2. Execute a command that pipes input, e.g. `ls | grep src`. It should
   auto-approve and succeed without dropping to an `ask_user` interaction block.
3. Test that `Ctrl+Y` no longer cycles the UI modes into YOLO.

## Pre-Merge Checklist

- [ ] Updated relevant documentation and README (if needed)
- [x] Added/updated tests (if needed)
- [ ] Noted breaking changes (if any)
