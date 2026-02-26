import React, { useState } from 'react';
import { parseRecipeText, parseRecipeUrl, saveRecipe } from '../services/recipeService';
import type { ParsedRecipe } from '../services/recipeService';
import { Loader2, Link as LinkIcon, FileText, Edit3 } from 'lucide-react';
import { IngredientList } from './IngredientList';
import { InstructionList } from './InstructionList';
import { TagList } from './TagList';

interface RecipeFormProps {
    onRecipeSaved?: () => void;
}

type InputMode = 'url' | 'text' | 'manual';

export const RecipeForm: React.FC<RecipeFormProps> = ({ onRecipeSaved }) => {
    const [inputMode, setInputMode] = useState<InputMode>('url');
    const [url, setUrl] = useState('');
    const [unstructuredText, setUnstructuredText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [manualRecipe, setManualRecipe] = useState<ParsedRecipe>({
        name: '',
        ingredients: [{ name: '', amount: '' }],
        instructions: [],
        tags: []
    });

    const handleParseText = async () => {
        if (!unstructuredText.trim()) return;

        setIsParsing(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await parseRecipeText(unstructuredText);
            setParsedRecipe(result);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to parse recipe');
        } finally {
            setIsParsing(false);
        }
    };

    const handleParseUrl = async () => {
        if (!url.trim()) return;

        setIsParsing(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await parseRecipeUrl(url);
            setParsedRecipe(result);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to parse recipe from URL');
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = async () => {
        const activeRecipe = inputMode === 'manual' ? manualRecipe : parsedRecipe;
        if (!activeRecipe) return;

        // Basic validation
        if (!activeRecipe.name.trim()) {
            setError('Recipe name is required');
            return;
        }

        const validIngredients = activeRecipe.ingredients.filter(i => i.name.trim() && i.amount.trim());
        if (validIngredients.length === 0) {
            setError('At least one ingredient with a name and amount is required');
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            await saveRecipe({
                name: activeRecipe.name,
                ingredients: validIngredients,
                instructions: activeRecipe.instructions || [],
                tags: activeRecipe.tags || [],
                originalText: inputMode === 'manual' ? undefined : (inputMode === 'url' ? url : unstructuredText)
            });
            setSuccess('Recipe saved successfully!');

            setUnstructuredText('');
            setUrl('');
            setParsedRecipe(null);
            setManualRecipe({ name: '', ingredients: [{ name: '', amount: '' }], instructions: [], tags: [] });
            setInputMode('url');

            if (onRecipeSaved) onRecipeSaved();
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to save recipe');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="glass-panel">
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <h2>Save a New Recipe</h2>
            </div>

            {!parsedRecipe && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid var(--border-subtle)' }}>
                    <button
                        onClick={() => setInputMode('url')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', background: inputMode === 'url' ? 'var(--bg-surface-hover)' : 'transparent', border: 'none', color: inputMode === 'url' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', fontWeight: inputMode === 'url' ? 600 : 400 }}
                    >
                        <LinkIcon size={18} /> URL Link
                    </button>
                    <button
                        onClick={() => setInputMode('text')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', background: inputMode === 'text' ? 'var(--bg-surface-hover)' : 'transparent', border: 'none', color: inputMode === 'text' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', fontWeight: inputMode === 'text' ? 600 : 400 }}
                    >
                        <FileText size={18} /> Paste Text
                    </button>
                    <button
                        onClick={() => setInputMode('manual')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', background: inputMode === 'manual' ? 'var(--bg-surface-hover)' : 'transparent', border: 'none', color: inputMode === 'manual' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s', fontWeight: inputMode === 'manual' ? 600 : 400 }}
                    >
                        <Edit3 size={18} /> Manual Entry
                    </button>
                </div>
            )}

            {error && (
                <div className="message-box message-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="message-box message-success">
                    {success}
                </div>
            )}

            {inputMode === 'manual' && !parsedRecipe && (
                <div className="space-y-6">
                    <div className="input-group">
                        <label className="input-label">Recipe Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            value={manualRecipe.name}
                            onChange={(e) => setManualRecipe({ ...manualRecipe, name: e.target.value })}
                            placeholder="e.g., Grandma's Chocolate Chip Cookies"
                            className="premium-input"
                        />
                    </div>

                    <IngredientList
                        ingredients={manualRecipe.ingredients}
                        onChange={(newIngredients) => setManualRecipe({ ...manualRecipe, ingredients: newIngredients })}
                    />

                    <InstructionList
                        instructions={manualRecipe.instructions || []}
                        onChange={(newInstructions) => setManualRecipe({ ...manualRecipe, instructions: newInstructions })}
                    />

                    <TagList
                        tags={manualRecipe.tags || []}
                        onChange={(newTags) => setManualRecipe({ ...manualRecipe, tags: newTags })}
                    />

                    <div className="mt-lg">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !manualRecipe.name.trim()}
                            className="btn-primary"
                        >
                            {isSaving ? (
                                <><Loader2 className="spin" /> Saving Recipe...</>
                            ) : (
                                'Save Manual Recipe'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {inputMode === 'url' && !parsedRecipe && (
                <div>
                    <div className="input-group">
                        <label className="input-label">Recipe URL</label>
                        <p className="helper-text">Enter the web address of a recipe (e.g., from NYT Cooking, AllRecipes, or a food blog). We will fetch and extract the ingredients for you.</p>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="premium-input"
                            placeholder="https://example.com/recipe"
                        />
                    </div>

                    <button
                        onClick={handleParseUrl}
                        disabled={isParsing || !url.trim()}
                        className="btn-primary"
                    >
                        {isParsing ? (
                            <><Loader2 className="spin" /> Fetching & Parsing...</>
                        ) : (
                            'Extract Recipe from URL'
                        )}
                    </button>
                </div>
            )}

            {inputMode === 'text' && !parsedRecipe && (
                <div>
                    <div className="input-group">
                        <label className="input-label">Paste Recipe Text</label>
                        <p className="helper-text">Paste any unstructured recipe from a website, blog, or notes app. We'll extract the ingredients and proportions automatically.</p>
                        <textarea
                            value={unstructuredText}
                            onChange={(e) => setUnstructuredText(e.target.value)}
                            className="premium-textarea"
                            placeholder="e.g. 2 cups flour, 1 tsp baking soda..."
                        />
                    </div>

                    <button
                        onClick={handleParseText}
                        disabled={isParsing || !unstructuredText.trim()}
                        className="btn-primary"
                    >
                        {isParsing ? (
                            <><Loader2 className="spin" /> Parsing Ingredients...</>
                        ) : (
                            'Parse Recipe Text'
                        )}
                    </button>
                </div>
            )}

            {parsedRecipe && (
                <div className="animate-in">
                    <div className="input-group">
                        <label className="input-label">Suggested Name</label>
                        <input
                            type="text"
                            value={parsedRecipe.name}
                            onChange={(e) => setParsedRecipe({ ...parsedRecipe, name: e.target.value })}
                            className="premium-input"
                        />
                    </div>

                    <div className="input-group">
                        <IngredientList
                            ingredients={parsedRecipe.ingredients}
                            onChange={(newIngredients) => setParsedRecipe({ ...parsedRecipe, ingredients: newIngredients })}
                        />
                    </div>

                    <div className="input-group">
                        <InstructionList
                            instructions={parsedRecipe.instructions || []}
                            onChange={(newInstructions) => setParsedRecipe({ ...parsedRecipe, instructions: newInstructions })}
                        />
                    </div>

                    <div className="input-group">
                        <TagList
                            tags={parsedRecipe.tags || []}
                            onChange={(newTags) => setParsedRecipe({ ...parsedRecipe, tags: newTags })}
                        />
                    </div>

                    <div className="flex-row mt-lg">
                        <button
                            onClick={() => setParsedRecipe(null)}
                            className="btn-secondary"
                        >
                            Back to Edit Text
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary"
                            style={{ flex: 1 }}
                        >
                            {isSaving ? (
                                <><Loader2 className="spin" /> Saving Recipe...</>
                            ) : (
                                'Save Recipe to Cookbook'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
