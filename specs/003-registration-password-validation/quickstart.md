# Quickstart: Testing Registration Password Validation

## Manual Verification Steps

1.  **Open Registration Page**: Navigate to `https://foodipe.redptam.com/register`.
2.  **Enter Password**: Type `Password123!` in the first Password field.
3.  **Test Mismatch**:
    - Type `Mismatch` in the "Confirm Password" field.
    - **Verify**: A red error message "Passwords do not match" appears.
    - **Verify**: The "Confirm Password" input field has a red border highlight.
    - **Verify**: The "Create Account" button is disabled.
4.  **Test Correction**:
    - Complete the "Confirm Password" field to match: `Password123!`.
    - **Verify**: The error message disappears.
    - **Verify**: The red border highlight is removed.
    - **Verify**: The "Create Account" button is enabled.
5.  **Test Submission**:
    - With matching passwords, click "Create Account" (ensure name and email are also filled).
    - **Verify**: You are redirected to the cookbook page (success).

## Success Criteria Checklist

- [ ] All password mismatch cases caught before API call.
- [ ] Users see clear visual feedback (red border + text).
- [ ] Account creation blocked while passwords mismatch.
- [ ] No layout jumps or performance degradation.
