import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeForm } from '../components/RecipeForm';

export const SaveRecipePage: React.FC = () => {
    const navigate = useNavigate();

    const handleRecipeSaved = () => {
        navigate('/');
    };

    return (
        <div className="page-container" style={{ maxWidth: '800px' }}>
            <header className="page-header">
                <h1 className="page-title">Save a Recipe</h1>
                <p className="page-subtitle">Pioneering your cookbook with elegant precision.</p>
            </header>

            <RecipeForm onRecipeSaved={handleRecipeSaved} />
        </div>
    );
};
