import React from 'react';
import { Search, X } from 'lucide-react';

interface CookbookSearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalRecipes: number;
    filteredCount: number;
}

export const CookbookSearch: React.FC<CookbookSearchProps> = ({
    searchQuery,
    onSearchChange,
    totalRecipes,
    filteredCount
}) => {
    return (
        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    className="premium-input"
                    placeholder="Search recipes by name, ingredient, or #tag..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                        paddingLeft: '3rem',
                        paddingRight: '3rem',
                        fontSize: '1.1rem',
                        height: '3.5rem',
                        borderRadius: '0.75rem'
                    }}
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            padding: '0.25rem',
                            borderRadius: '50%',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--text-primary)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--text-muted)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {searchQuery ? (
                        <>Showing <strong>{filteredCount}</strong> of <strong>{totalRecipes}</strong> recipes</>
                    ) : (
                        <>You have <strong>{totalRecipes}</strong> recipes in your cookbook</>
                    )}
                </span>
            </div>
        </div>
    );
};
