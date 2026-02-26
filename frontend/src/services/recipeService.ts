import axios from 'axios';

// Vite proxies /api to the backend container
const API_URL = '/api/recipes';

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

// Helper to get auth header
const getAuthHeaders = () => {
    const storedUser = localStorage.getItem('foodipe_user');
    let token = '';
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            token = user.token || '';
        } catch (e) {
            console.error('Failed to parse user token');
        }
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const parseRecipeText = async (text: string): Promise<ParsedRecipe> => {
    const response = await axios.post(`${API_URL}/parse`, { text }, getAuthHeaders());
    return response.data;
};

export const parseRecipeUrl = async (url: string): Promise<ParsedRecipe> => {
    const response = await axios.post(`${API_URL}/parse-url`, { url }, getAuthHeaders());
    return response.data;
};

export const saveRecipe = async (recipeData: { name: string; ingredients: Ingredient[]; instructions: string[]; tags?: string[]; originalText?: string }) => {
    const response = await axios.post(API_URL, recipeData, getAuthHeaders());
    return response.data;
};

export const getRecipes = async (): Promise<SavedRecipe[]> => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const updateRecipe = async (id: string, recipeData: { name: string; ingredients: Ingredient[]; instructions: string[]; tags?: string[] }): Promise<SavedRecipe> => {
    const response = await axios.put(`${API_URL}/${id}`, recipeData, getAuthHeaders());
    return response.data;
};

export const deleteRecipe = async (id: string): Promise<{ id: string }> => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};
