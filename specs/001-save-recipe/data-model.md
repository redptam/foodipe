# Data Model: Save Recipe

## Entities

### User
*Authentication is required, implying a basic User entity is needed for foreign keys, even if managed by an external provider like Auth0/Clerk initially.*
- `_id`: ObjectId
- `authProviderId`: String (Unique)
- `email`: String (Optional, depending on provider)
- `createdAt`: Date

### Recipe
*The core entity representing a saved dish for a user.*
- `_id`: ObjectId
- `userId`: ObjectId (Ref -> User, Required)
- `name`: String (Required)
- `ingredients`: Array of Ingredient sub-documents (Required)
- `createdAt`: Date
- `updatedAt`: Date

### Ingredient (Sub-document)
*A specific item needed for the recipe.*
- `name`: String (Required)
- `amount`: String (Optional, e.g., "To taste" or "1 pinch" if exact number isn't provided)
