<!-- Sync Impact Report:
- Version change: 1.1.0 → 1.2.0
- Added Principles: Code Quality and Maintainability, Performance Requirements
- Modified Principles: Test-Driven Quality → Testing Standards, User-Centric Design → User Experience Consistency
- Removed sections: None
- Templates requiring updates: 
  - ✅ .specify/templates/plan-template.md
- Follow-up TODOs: None
-->
# Foodipe Constitution

## Core Principles

### I. Web-Based Architecture
The application MUST be a web-based platform. The frontend MUST be built using React. The backend MUST be built using Node.js (v24 LTS).

### II. API-Driven Client/Server Separation
The system MUST consist of strictly separated client and server applications. Communication between the React frontend and Node.js backend MUST occur exclusively via a secure API (e.g., REST or GraphQL over HTTPS).

### III. Document Database Standard
Data MUST be stored in a document-based database. **MongoDB** is the recommended standard for this stack due to its native JSON/BSON compatibility with Node.js and React, flexibility with unstructured data, and rich ecosystem.

### IV. Code Quality and Maintainability
The application MUST adhere to strict code quality guidelines. Code should be clean, readable, well-documented, and follow consistent formatting and linting rules. Technical debt should be managed proactively.

### V. Testing Standards
Critical business logic MUST have comprehensive unit tests. Core user journeys MUST be covered by integration and end-to-end tests. Code coverage metrics should be maintained, and tests MUST pass in CI/CD pipelines before any code is merged.

### VI. User Experience Consistency
All features MUST prioritize a consistent and intuitive user experience. The application MUST be mobile-first, responsive, and accessible (WCAG compliant). UI components and design patterns should be reused to ensure familiarity across the platform.

### VII. Performance Requirements
The application MUST perform efficiently under load. Frontend components should be optimized for fast rendering and minimal bundle sizes. Backend APIs MUST respond quickly, utilizing appropriate caching and database indexing strategies.

### VIII. Component-Driven UI
The React UI MUST be built with reusable, encapsulated components. Components should have clear properties, manage own state when appropriate, and avoid direct dependency on global state where possible to ensure reusability.

## Technology Standards

- **Frontend**: React
- **Backend**: Node.js v24 LTS
- **Database**: Document Database (MongoDB recommended)
- **Communication**: Secure API

All new code MUST follow the established linting and formatting rules. The primary tech stack should remain consistent unless there is a strong justification and team consensus for introducing new technologies.

## Development Workflow

- All changes MUST be proposed via Pull Requests.
- Code review is REQUIRED for all changes bridging to production.
- CI/CD pipelines MUST pass (linting, tests, build) before merging.

## Governance
This constitution supersedes all other practices. Amendments require documentation, team approval, and a clear migration plan for existing code if the rules change. Every PR review MUST verify compliance with these principles.

**Version**: 1.2.0 | **Ratified**: 2026-02-21 | **Last Amended**: 2026-02-22
