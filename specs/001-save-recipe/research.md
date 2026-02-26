# Research: Save Recipe Feature

This document captures the technology choices and research decisions explicitly resolving the unknowns from the technical context.

## 1. Web Frameworks (Primary Dependencies)

**Decision**: Vite + React (Frontend), Express.js (Backend)

**Rationale**:
- **Frontend**: Vite provides a modern, extremely fast build setup for React applications with minimal overhead. It is currently the community standard for SPAs.
- **Backend**: Express.js is the most mature, widely-supported REST API framework for Node.js, fulfilling the "secure API" and "API-Driven Separation" constitution principles with minimal boilerplate for a 5-endpoint MVPs.

**Alternatives considered**: Next.js (rejected due to preference for strict client/server separation in distinct folders rather than a monolithic fullstack framework), NestJS (rejected as too heavy for an MVP).

## 2. LLM Parsing Integration

**Decision**: OpenAI Node.js SDK (with `gpt-4o-mini` model)

**Rationale**:
- Offers structural JSON output enforcement (`response_format: { type: "json_object" }`).
- Very fast performance (critical for the sub-30s UX goal) and high accuracy for unstructured text.

**Alternatives considered**: Local heuristic regex parser (rejected per user preference), Anthropic Claude (comparable, but OpenAI json-mode is well-established for extraction tasks).

## 3. Testing Frameworks

**Decision**: Vitest (Frontend), Jest + Supertest (Backend)

**Rationale**:
- **Vitest**: Native to Vite projects, fast, and works seamlessly with React Testing Library.
- **Jest + Supertest**: The industry standard for Express API testing, enabling end-to-end integration tests over the mocked endpoints.

**Alternatives considered**: Playwright/Cypress (deferred until later for full E2E, focusing on robust unit/integration tests first as per constitution).
