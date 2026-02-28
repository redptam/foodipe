# Research & Implementation Strategy: Registration Password Validation

## Decision: React State-Based Real-Time Validation

**Rationale**: Since the registration form is already a controlled component (using `useState` for name, email, password, etc.), adding a validation check inside the `onChange` handlers or via a `useEffect` is the most efficient and standard React approach.

### Implementation Details

1.  **State Extension**: Add a boolean state `isPasswordMismatched` to track the validation status.
2.  **Validation Logic**:
    ```javascript
    const passwordsMatch = password === confirmPassword;
    const showMismatchedError = confirmPassword.length > 0 && !passwordsMatch;
    ```
3.  **UI Feedback**:
    - **Error Message**: Conditionally render a small error message below the "Confirm Password" field.
    - **Input Highlight**: Apply a conditional class (e.g., `input-error`) to the "Confirm Password" input that triggers a red border in CSS.
    - **Button State**: Add `!passwordsMatch` to the `disabled` prop of the "Create Account" button.

### Alternatives Considered

- **Formik/React Hook Form**: Rejected because the project already uses a simple state-based approach for this form, and adding a heavy form library for one validation rule is overkill.
- **On-Blur Validation**: Rejected in favor of real-time feedback as per user preference (Option A).

## UI Styling (Premium Feel)

To maintain the "premium" feel of Foodipe:
- Use a soft red (`#ff4d4d` or similar) for the border and text.
- Add a subtle transition effect for the border color change.
- Ensure the error message doesn't cause a layout jump by reserving space or using absolute positioning if appropriate.
