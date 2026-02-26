# Feature Specification: Save Recipe

**Feature Branch**: `001-save-recipe`  
**Created**: 2026-02-22  
**Status**: Draft  
**Input**: User description: "Foodipe is a way for users to save recipes. They should be able to paste in a recipe into a large text area, then the application parses out the ingredients and amount into a list. The application will suggest a name for the recipe. There should be a save button. Also, a user should be able to enter a named recipe, tha the user supplies, and enter each ingredient indepencently with amounts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Parse Pasted Recipe (Priority: P1)

Users want a fast way to import recipes they find online or have in plain text by just pasting them into the application without manually formatting each line.

**Why this priority**: Pasting unstructured text is the easiest entry point for a user, minimizing friction to save their first recipe.

**Independent Test**: Can be fully tested by pasting standard recipe text into an input area, observing the parsed list of ingredients and suggested name, and verifying the recipe saves correctly.

**Acceptance Scenarios**:

1. **Given** the recipe entry screen, **When** the user pastes unstructured recipe text and initiates parsing, **Then** the system populates a list of recognized ingredients with their respective amounts.
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
3. **Given** a manually constructed recipe, **When** the user clicks save, **Then** the recipe is persisted to their collection.

---

### Edge Cases

- What happens when the pasted text contains no recognizable ingredients? (System should gracefully fall back to manual entry).
- What happens when a manual ingredient is missing an amount? (System should allow it as "to taste" or prompt for an amount).
- How does the system handle extremely long text pasted into the text area?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a multiline text area for users to paste unstructured recipe text.
- **FR-002**: System MUST process pasted text to extract individual ingredients and their amounts into a structured list.
- **FR-003**: System MUST generate and suggest a recipe name based on the content of the pasted text.
- **FR-004**: System MUST allow users to save a complete recipe (name + ingredients).
- **FR-005**: System MUST provide input fields for users to manually enter a recipe name.
- **FR-006**: System MUST provide input fields for users to manually add, edit, or remove individual ingredients with their amounts.
- **FR-007**: System MUST parse the unstructured text using an LLM API to accurately extract ingredients and amounts, handling complex or poorly formatted text.
- **FR-008**: System MUST allow the user to manually edit the resulting ingredient list and suggested name after parsing is complete, before saving the recipe.
- **FR-009**: System MUST require user authentication to save recipes, and recipes MUST be tied to the authenticated user's account in the MongoDB backend.

### Key Entities *(include if feature involves data)*

- **Recipe**: The core entity representing a saved dish. It contains a `name` and a collection of `ingredients`.
- **Ingredient**: A sub-entity of a Recipe, representing a specific needed item. It contains a `name` (e.g., "Flour") and an `amount` (e.g., "2 cups").

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The parsing system accurately extracts at least 85% of ingredients and amounts from standard recipe text.
- **SC-002**: The automated recipe name suggestion is accepted by the user without edits in at least 70% of parsed recipes.
- **SC-003**: Users can successfully parse, review, and save a pasted recipe in under 30 seconds.
- **SC-004**: Users can manually input a 5-ingredient recipe from scratch in under 2 minutes.
