# Feature Specification: Save Recipe

**Feature Branch**: `001-save-recipe`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Foodipe is a way for users to save recipes. They should be able to paste in a recipe into a large text area, then the application parses out the ingredients and amount into a list. The application will suggest a name for the recipe. There should be a save button. Also, a user should be able to enter a named recipe, tha the user supplies, and enter each ingredient indepencently with amounts."

## Clarifications

### Session 2026-02-27

- Q: Which LLM provider should we integrate for parsing the unstructured recipe text? → A: OpenAI API (gpt-3.5-turbo / gpt-4o-mini)
- Q: How should the "amount" of an ingredient be structured in the database? → A: Single unstructured string (e.g., "2 cups")
- Q: How should the system handle pasted text that completely fails to parse? → A: Reject with error, keep text
- Q: How should the system handle recipe instructions/steps? → A: Have the LLM also parse out step-by-step instructions from the pasted text
- Q: What are the specific deployment constraints for the database? → A: MongoDB 8.0 with mandatory authentication (username/password)
- Q: How to handle 401 session expiry when saving a manually entered recipe? → A: Automatically save a draft to local storage, redirect to login, restore on return.
- Q: How should the frontend handle parsed URL scraper failures (e.g., 403 or SSRF block)? → A: Show the specific error reason and gracefully suggest the manual copy/paste fallback.
- Q: How should the frontend handle 429 Too Many Requests from the new backend rate limiters? → A: Catch 429 errors globally via a network interceptor and show a unified toast/alert.
- Q: How should the frontend handle extremely long pasted text that exceeds the 50kb backend limit? → A: Add a client-side character limit to the textarea to block massive pastes before hitting the network.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parse Pasted Recipe (Priority: P1)

Users want a fast way to import recipes they find online or have in plain text by just pasting them into the application without manually formatting each line.

**Why this priority**: Pasting unstructured text is the easiest entry point for a user, minimizing friction to save their first recipe.

**Independent Test**: Can be fully tested by pasting standard recipe text into an input area, observing the parsed list of ingredients and suggested name, and verifying the recipe saves correctly.

**Acceptance Scenarios**:

1. **Given** the recipe entry screen, **When** the user pastes unstructured recipe text and initiates parsing, **Then** the system populates a list of recognized ingredients with their respective amounts, and a list of step-by-step instructions.
2. **Given** the parsed recipe, **When** the parsing completes, **Then** the system automatically suggests a matching recipe name.
3. **Given** a parsed recipe with a name and ingredients, **When** the user clicks save, **Then** the recipe is persisted.

---

### User Story 2 - Manual Recipe Entry (Priority: P2)

Users want to manually create a recipe by providing a name and explicitly defining each ingredient and its amount one by one.

**Why this priority**: Users need manual control for original recipes or when the parser misses details. It ensures all edge cases for recipe creation are covered.

**Independent Test**: Can be fully tested by leaving the paste area blank, typing a custom recipe name, adding distinct ingredients with amounts, and saving the result.

**Acceptance Scenarios**:

1. **Given** the recipe entry screen, **When** the user enters a custom recipe name, **Then** the title is updated.
2. **Given** the manual entry section, **When** the user adds an ingredient name and amount, **Then** it appears in the structured ingredient list.
3. **Given** the manual entry section, **When** the user adds an instruction step, **Then** it appears in the structured instructions list.
4. **Given** a manually constructed recipe, **When** the user clicks save, **Then** the recipe is persisted to their collection.

---

### Edge Cases

- What happens when the pasted text contains no recognizable ingredients, or parsing completely fails? (System MUST display an error message and retain the pasted text in the text area so the user can manually edit it or switch to manual entry).
- What happens when a manual ingredient is missing an amount? (System should allow it as "to taste" or prompt for an amount).
- How does the system handle extremely long text pasted into the text area? (System MUST enforce a client-side character limit on the text area to prevent 413 Payload Too Large errors from the 50kb backend limit).
- What happens if the user's session expires while they are entering a recipe? (System MUST catch 401 Unauthorized save failures, automatically persist the draft to `sessionStorage`/`localStorage`, redirect to login, and restore the draft upon successful return).
- What happens if the backend blocks a recipe URL fetch (SSRF guard) or the external site denies the request (403)? (System MUST show the specific reason it failed, e.g., "Website blocked our request," and suggest the user copy/paste the text manually).

## Requirements *(mandatory)*

### Non-Functional Quality Attributes & Constraints

- **CR-001**: The system MUST use MongoDB version 8.0.
- **CR-002**: The MongoDB deployment MUST require authentication (username and password) for all connections.

### Functional Requirements

- **FR-001**: System MUST provide a multiline text area for users to paste unstructured recipe text.
- **FR-002**: System MUST process pasted text to extract individual ingredients (with amounts) and step-by-step instructions into structured lists.
- **FR-003**: System MUST generate and suggest a recipe name based on the content of the pasted text.
- **FR-004**: System MUST allow users to save a complete recipe (name, ingredients, instructions).
- **FR-005**: System MUST provide input fields for users to manually enter a recipe name.
- **FR-006**: System MUST provide input fields for users to manually add, edit, or remove individual ingredients with their amounts, and individual instruction steps.
- **FR-007**: System MUST parse the unstructured text using the OpenAI API (gpt-3.5-turbo / gpt-4o-mini) to accurately extract ingredients, amounts, and instructions, handling complex or poorly formatted text.
- **FR-008**: System MUST allow the user to manually edit the resulting ingredient list, instruction list, and suggested name after parsing is complete, before saving the recipe.
- **FR-009**: System MUST require user authentication to save recipes, and recipes MUST be tied to the authenticated user's account in the MongoDB backend.
- **FR-010**: System MUST globaly intercept HTTP 429 (Too Many Requests) errors across all network calls and display a unified, friendly alert to prevent confused UI states during rate limiting.

### Key Entities *(include if feature involves data)*

- **Recipe**: The core entity representing a saved dish. It contains a `name`, a collection of `ingredients`, and an array of `instructions` (strings).
- **Ingredient**: A sub-entity of a Recipe, representing a specific needed item. It contains a `name` (e.g., "Flour") and an `amount` as a single string (e.g., "2 cups").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The parsing system accurately extracts at least 85% of ingredients and amounts from standard recipe text.
- **SC-002**: The automated recipe name suggestion is accepted by the user without edits in at least 70% of parsed recipes.
- **SC-003**: Users can successfully parse, review, and save a pasted recipe in under 30 seconds.
- **SC-004**: Users can manually input a 5-ingredient recipe from scratch in under 2 minutes.
