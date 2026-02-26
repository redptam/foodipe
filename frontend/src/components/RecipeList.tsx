import React, { useEffect, useState } from 'react';
import { getRecipes, updateRecipe } from '../services/recipeService';
import type { SavedRecipe, Ingredient } from '../services/recipeService';
import { deleteRecipe } from '../services/recipeService';
import { Loader2, BookOpen, Edit2, Check, X, Trash2 } from 'lucide-react';
import { IngredientList } from './IngredientList';
import { InstructionList } from './InstructionList';
import { TagList } from './TagList';
import { CookbookSearch } from './CookbookSearch';

interface RecipeListProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const RecipeList: React.FC<RecipeListProps> = ({ searchQuery, onSearchChange }) => {
    const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ name: string, ingredients: Ingredient[], instructions: string[], tags: string[] }>({ name: '', ingredients: [], instructions: [], tags: [] });
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [expandedIngredients, setExpandedIngredients] = useState<Set<string>>(new Set());
    const [expandedInstructions, setExpandedInstructions] = useState<Set<string>>(new Set());

    const toggleExpandedIngredient = (id: string) => {
        setExpandedIngredients(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleExpandedInstruction = (id: string) => {
        setExpandedInstructions(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const startEdit = (recipe: SavedRecipe) => {
        setEditingId(recipe._id);
        setEditForm({ name: recipe.name, ingredients: recipe.ingredients, instructions: recipe.instructions || [], tags: recipe.tags || [] });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = async () => {
        if (!editingId) return;

        if (!editForm.name.trim() || editForm.ingredients.length === 0) {
            setError('Name and at least one ingredient are required to save edits.');
            return;
        }

        setIsSavingEdit(true);
        setError(null);
        try {
            const updated = await updateRecipe(editingId, editForm);
            setRecipes(recipes.map(r => r._id === updated._id ? updated : r));
            setEditingId(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update recipe');
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        setError(null);
        try {
            await deleteRecipe(id);
            setRecipes(recipes.filter(r => r._id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to delete recipe');
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch recipes');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
                <Loader2 className="spin" style={{ color: 'var(--accent-button)', width: '2rem', height: '2rem' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="message-box message-error">
                {error}
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="glass-panel empty-state">
                <BookOpen size={48} />
                <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>No recipes saved yet.</p>
                <p className="helper-text" style={{ marginTop: '0.5rem' }}>Paste a recipe on the left to start your cookbook!</p>
            </div>
        );
    }

    const filteredRecipes = recipes.filter(recipe => {
        if (!searchQuery) return true;

        const loweredQuery = searchQuery.toLowerCase();

        // Search by name
        if (recipe.name.toLowerCase().includes(loweredQuery)) return true;

        // Search by tags (strip '#' if user typed it)
        const tagSearchQuery = loweredQuery.startsWith('#') ? loweredQuery.substring(1) : loweredQuery;
        if (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(tagSearchQuery))) return true;

        // Search by ingredient names
        if (recipe.ingredients.some(ing => ing.name.toLowerCase().includes(loweredQuery))) return true;

        return false;
    });

    return (
        <div style={{ padding: '0 1rem' }}>
            <CookbookSearch
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                totalRecipes={recipes.length}
                filteredCount={filteredRecipes.length}
            />

            <div className="cookbook-list" style={{ padding: '0 0.5rem', maxHeight: 'none' }}>
                {filteredRecipes.length === 0 && searchQuery ? (
                    <div className="glass-panel empty-state">
                        <BookOpen size={48} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>No recipes found matching "{searchQuery}".</p>
                        <button
                            className="btn-secondary mt-md"
                            onClick={() => onSearchChange('')}
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    filteredRecipes.map((recipe) => {
                        if (editingId === recipe._id) {
                            return (
                                <div key={recipe._id} className="recipe-card glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                                    <div className="input-group">
                                        <label className="input-label">Recipe Name</label>
                                        <input
                                            className="premium-input"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        />
                                    </div>
                                    <IngredientList
                                        ingredients={editForm.ingredients}
                                        onChange={(ings) => setEditForm({ ...editForm, ingredients: ings })}
                                    />
                                    <InstructionList
                                        instructions={editForm.instructions}
                                        onChange={(insts) => setEditForm({ ...editForm, instructions: insts })}
                                    />
                                    <TagList
                                        tags={editForm.tags || []}
                                        onChange={(tags) => setEditForm({ ...editForm, tags: tags })}
                                    />
                                    <div className="flex-row mt-lg">
                                        <button
                                            className="btn-secondary"
                                            onClick={() => handleDelete(recipe._id, recipe.name)}
                                            disabled={isSavingEdit}
                                            style={{ color: 'var(--text-danger)', borderColor: 'rgba(255, 50, 50, 0.3)', padding: '0.75rem' }}
                                            title="Delete Recipe"
                                            type="button"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="btn-secondary" onClick={cancelEdit} disabled={isSavingEdit} type="button">
                                            <X size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} /> Cancel
                                        </button>
                                        <button className="btn-primary" onClick={saveEdit} disabled={isSavingEdit} style={{ flex: 1 }} type="button">
                                            {isSavingEdit ? <Loader2 className="spin" size={18} /> : <Check size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'text-bottom' }} />} Save Changes
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={recipe._id} className="recipe-card glass-panel group" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                                <div className="flex-between">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h2 className="recipe-title">{recipe.name}</h2>
                                        {recipe.originalText && (
                                            <span className="ai-badge">AI Parsed</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => startEdit(recipe)}
                                            className="btn-icon"
                                            title="Edit Recipe"
                                            style={{ position: 'relative', zIndex: 10 }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {recipe.tags && recipe.tags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                                        {recipe.tags.map((tag: string, i: number) => (
                                            <span key={i} style={{
                                                fontSize: '0.75rem',
                                                padding: '0.2rem 0.6rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'var(--text-secondary)',
                                                borderRadius: '1rem',
                                                border: '1px solid rgba(255,255,255,0.05)'
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                                    <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>Ingredients</h4>
                                    {(expandedIngredients.has(recipe._id) ? recipe.ingredients : recipe.ingredients.slice(0, 8)).map((ing, i) => (
                                        <p key={i} className="recipe-ingredient">
                                            <strong>{ing.amount}</strong> {ing.name}
                                        </p>
                                    ))}
                                    {recipe.ingredients.length > 8 && (
                                        <button
                                            type="button"
                                            onClick={() => toggleExpandedIngredient(recipe._id)}
                                            style={{ fontSize: '0.85rem', color: 'var(--accent-button)', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, position: 'relative', zIndex: 2 }}
                                        >
                                            {expandedIngredients.has(recipe._id) ? "- Show less" : `+ ${recipe.ingredients.length - 8} more ingredients`}
                                        </button>
                                    )}
                                </div>

                                {recipe.instructions && recipe.instructions.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => toggleExpandedInstruction(recipe._id)}
                                            style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 2 }}
                                        >
                                            {expandedInstructions.has(recipe._id) ? "- Hide Instructions" : "+ Instructions"}
                                        </button>
                                        {expandedInstructions.has(recipe._id) && (
                                            <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                                {recipe.instructions.map((step, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                                        <span style={{ color: 'var(--accent-button)', fontWeight: 600, minWidth: '1.5rem' }}>{i + 1}.</span>
                                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <p className="recipe-meta">
                                    Added {new Date(recipe.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
