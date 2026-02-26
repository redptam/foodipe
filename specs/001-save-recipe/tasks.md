---
description: "Task list template for feature implementation (Dockerized)"
---

# Tasks: Save Recipe

**Input**: Design documents from `/specs/001-save-recipe/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api.md

**Tests**: Tests are requested explicitly per the constitution (Test-Driven Quality). Foundational tests (API, unit) will be integrated into the tasks below.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure & Docker)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize React frontend project with Vite (`npm create vite@latest frontend -- --template react-ts`)
- [x] T002 Initialize Node.js backend project (`npm init -y` inside `backend/`)
- [x] T003 Create `backend/Dockerfile` using Node 24 LTS
- [x] T004 Create `frontend/Dockerfile` using Node 24 LTS
- [x] T005 Create `docker-compose.yml` defining `frontend`, `backend`, and `mongo` services
- [ ] T006 [P] Install backend dependencies (`express`, `mongoose`, `openai`, `dotenv`, `cors`) via intermediate container or local execution
- [ ] T007 [P] Install frontend dependencies (`axios`, `react-router-dom`, `lucide-react`, test libraries) via intermediate container or local execution
- [ ] T008 [P] Setup backend Testing (`jest`, `supertest`) and Frontend Testing (`vitest`, `@testing-library/react`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Setup MongoDB connection logic in `backend/src/config/db.js` pointing to the docker `mongo` service hostname.
- [x] T010 Setup Express server, CORS, and base error handling in `backend/src/app.js` and `backend/src/server.js`
- [x] T011 [P] Create `User` Mongoose model in `backend/src/models/User.js`
- [x] T012 [P] Create `Recipe` and `Ingredient` Mongoose models in `backend/src/models/Recipe.js`
- [x] T013 Setup basic authentication middleware in `backend/src/middleware/auth.js` (Mocked or simple JWT for MVP)
- [x] T014 Configure frontend Vite proxy to backend in `frontend/vite.config.ts`

**Checkpoint**: Foundation and containers ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Parse Pasted Recipe (Priority: P1) 🎯 MVP

**Goal**: Users can paste unstructured text, have it parsed by an LLM into ingredients, suggesting a name, and save it.

**Independent Test**: Can be fully tested by pasting standard recipe text into an input area, observing the parsed list of ingredients and suggested name, and verifying the recipe saves correctly.

### Tests for User Story 1 ⚠️

- [ ] T015 [P] [US1] Integration test for LLM parsing endpoint in `backend/tests/integration/parseRecipe.test.js`
- [ ] T016 [P] [US1] Unit test for recipe save endpoint in `backend/tests/integration/saveRecipe.test.js`
- [ ] T017 [P] [US1] Component test for `RecipeForm` rendering and API mocking in `frontend/src/components/__tests__/RecipeForm.test.tsx`

### Implementation for User Story 1

- [x] T018 [US1] Implement LLM parsing service using OpenAI SDK in `backend/src/services/llmService.js`
- [x] T019 [US1] Implement POST `/api/recipes/parse` endpoint in `backend/src/api/recipeRoutes.js`
- [x] T020 [US1] Implement POST `/api/recipes` save endpoint in `backend/src/api/recipeRoutes.js`
- [x] T021 [P] [US1] Create frontend `RecipeService` for API calls in `frontend/src/services/recipeService.ts`
- [x] T022 [US1] Create `RecipeForm` component with paste text area and logic in `frontend/src/components/RecipeForm.tsx`
- [x] T023 [US1] Create `SaveRecipePage` view integrating the `RecipeForm` in `frontend/src/pages/SaveRecipePage.tsx`
- [x] T024 [US1] Setup React Router in `frontend/src/App.tsx` pointing to `SaveRecipePage`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manual Recipe Entry (Priority: P2)

**Goal**: Users can manually create a recipe by providing a name and explicitly defining each ingredient and its amount one by one.

**Independent Test**: Can be fully tested by leaving the paste area blank, typing a custom recipe name, adding distinct ingredients with amounts, and saving the result.

### Tests for User Story 2 ⚠️

- [ ] T025 [P] [US2] Component test for adding/removing manual ingredient rows in `frontend/src/components/__tests__/IngredientList.test.tsx`

### Implementation for User Story 2

- [x] T026 [P] [US2] Create standalone `IngredientList` component to manage manual rows in `frontend/src/components/IngredientList.tsx`
- [x] T027 [US2] Integrate `IngredientList` into existing `RecipeForm.tsx` to allow switching between Parse-mode and Manual-mode.
- [x] T028 [US2] Add manual recipe name input field to `RecipeForm.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T029 [P] Add loading states and error toast notifications in React components
- [x] T030 Code cleanup, removing console.logs, and strict TypeScript/JSDoc typing where applicable
- [x] T031 Update `README.md` at repository root with execution instructions matching `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must be completely executed to scaffold Docker containers
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US2 (Manual Entry) requires the form scaffolding built over the course of US1 (Parse Pasted Recipe).

### Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`docker compose up --build` must be working natively)
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test parsing pasted text with real OpenAI credentials inside the Docker environment
5. Once working, proceed to US2 to add manual overrides to the form.
