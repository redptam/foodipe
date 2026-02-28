import { z } from 'zod';

// --- Auth Schemas ---
export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address').max(200),
    password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').max(200),
    password: z.string().min(1, 'Password is required').max(128),
});

// --- Recipe Schemas ---
export const ingredientSchema = z.object({
    name: z.string().min(1).max(200),
    amount: z.string().min(1).max(100),
});

export const createRecipeSchema = z.object({
    name: z.string().min(1, 'Recipe name is required').max(300),
    ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required').max(200),
    instructions: z.array(z.string().max(2000)).max(100).default([]),
    tags: z.array(z.string().max(50)).max(30).default([]),
    originalText: z.string().max(100000).optional(),
});

export const updateRecipeSchema = z.object({
    name: z.string().min(1).max(300).optional(),
    ingredients: z.array(ingredientSchema).min(1).max(200).optional(),
    instructions: z.array(z.string().max(2000)).max(100).optional(),
    tags: z.array(z.string().max(50)).max(30).optional(),
});

export const parseTextSchema = z.object({
    text: z.string().min(10, 'Recipe text is required').max(50000),
});

export const parseUrlSchema = z.object({
    url: z.string().url('Invalid URL format').max(2000),
});

// --- Middleware factory ---
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: result.error.flatten().fieldErrors,
        });
    }
    req.body = result.data;
    next();
};
