import React from 'react';
import type { Ingredient } from '../services/recipeService';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface IngredientListProps {
    ingredients: Ingredient[];
    onChange: (ingredients: Ingredient[]) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onChange }) => {
    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        onChange(newIngredients);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        onChange(newIngredients);
    };

    const addIngredient = () => {
        onChange([...ingredients, { name: '', amount: '' }]);
    };

    return (
        <div>
            <div className="flex-between mb-sm">
                <label className="input-label" style={{ marginBottom: 0 }}>Ingredients ({ingredients.length})</label>
                <button
                    onClick={addIngredient}
                    className="btn-text"
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Ingredient
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {ingredients.length === 0 && (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                        No ingredients added yet. Click 'Add Ingredient' to begin.
                    </div>
                )}
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-row">
                        <GripVertical className="drag-handle" size={20} />
                        <input
                            type="text"
                            value={ingredient.amount}
                            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                            placeholder="Amount (e.g. 2 cups)"
                            className="premium-input"
                            style={{ flex: '0 0 30%' }}
                        />
                        <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            placeholder="Ingredient Name"
                            className="premium-input"
                            style={{ flex: 1 }}
                        />
                        <button
                            onClick={() => removeIngredient(index)}
                            className="btn-icon text-danger"
                            title="Remove ingredient"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
