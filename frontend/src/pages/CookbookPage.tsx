import React, { useState } from 'react';
import { RecipeList } from '../components/RecipeList';

export const CookbookPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="page-container">
            <header className="page-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <h1 className="page-title" style={{ fontSize: '2.5rem' }}>Your Cookbook</h1>
                <p className="page-subtitle">All your parsed and saved recipes in one place.</p>
            </header>

            <RecipeList searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
    );
};
