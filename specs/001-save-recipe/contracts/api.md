# API Contracts: Save Recipe

## Endpoint: POST `/api/recipes/parse`
**Description**: Accepts unstructured recipe text, sends it to the LLM, and returns structured ingredients and a suggested name.
**Auth**: Required (Bearer Token)

**Request Body (`application/json`)**:
```json
{
  "text": "1 cup flour\n2 eggs\nBake at 350."
}
```

**Response (`200 OK`)**:
```json
{
  "suggestedName": "Simple Flour and Eggs",
  "ingredients": [
    { "name": "flour", "amount": "1 cup" },
    { "name": "eggs", "amount": "2" }
  ]
}
```

---

## Endpoint: POST `/api/recipes`
**Description**: Saves a user-confirmed recipe (after optional manual edits) to the database.
**Auth**: Required (Bearer Token)

**Request Body (`application/json`)**:
```json
{
  "name": "My Custom Cake",
  "ingredients": [
    { "name": "flour", "amount": "1 cup" },
    { "name": "eggs", "amount": "2" }
  ]
}
```

**Response (`201 Created`)**:
```json
{
  "_id": "60d5ec49f1b2c8a14c2b98a1",
  "userId": "60d5ec49f1b2c8a14c2b98a0",
  "name": "My Custom Cake",
  "ingredients": [
    { "name": "flour", "amount": "1 cup" },
    { "name": "eggs", "amount": "2" }
  ],
  "createdAt": "2026-02-22T00:00:00.000Z",
  "updatedAt": "2026-02-22T00:00:00.000Z"
}
```
