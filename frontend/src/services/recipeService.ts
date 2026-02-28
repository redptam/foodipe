import axios from 'axios';

// All API calls use withCredentials so the HttpOnly auth cookie is sent automatically.
// No manual Authorization header or token management needed.
const api = axios.create({
    baseURL: '/api/recipes',
    withCredentials: true,
});

export interface Ingredient {
    name: string;
    amount: string;
}

export interface ParsedRecipe {
    name: string;
    ingredients: Ingredient[];
    instructions: string[];
    tags?: string[];
}

export interface SavedRecipe extends ParsedRecipe {
    _id: string;
    originalText?: string;
    createdAt: string;
    tags?: string[];
}

export const parseRecipeText = async (text: string): Promise<ParsedRecipe> => {
    const response = await api.post('/parse', { text });
    return response.data;
};

export const parseRecipeUrl = async (url: string): Promise<ParsedRecipe> => {
    const response = await api.post('/parse-url', { url });
    return response.data;
};

export const saveRecipe = async (recipeData: {
    name: string;
    ingredients: Ingredient[];
    instructions: string[];
    tags?: string[];
    originalText?: string;
}): Promise<SavedRecipe> => {
    const response = await api.post('/', recipeData);
    return response.data;
};

export const getRecipes = async (): Promise<SavedRecipe[]> => {
    const response = await api.get('/');
    return response.data;
};

export const updateRecipe = async (
    id: string,
    recipeData: { name: string; ingredients: Ingredient[]; instructions: string[]; tags?: string[] }
): Promise<SavedRecipe> => {
    const response = await api.put(`/${id}`, recipeData);
    return response.data;
};

export const deleteRecipe = async (id: string): Promise<{ id: string }> => {
    const response = await api.delete(`/${id}`);
    return response.data;
};
