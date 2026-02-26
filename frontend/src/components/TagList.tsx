import React, { useState } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';

interface TagListProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

export const TagList: React.FC<TagListProps> = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        const value = inputValue.trim().toLowerCase();
        if (value && !tags.includes(value)) {
            onChange([...tags, value]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>Tags</h4>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '38px' }}>
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.35rem 0.75rem',
                            background: 'var(--accent-hover)',
                            color: 'white',
                            borderRadius: '1rem',
                            fontSize: '0.85rem',
                            fontWeight: 500
                        }}
                    >
                        # {tag}
                        <button
                            type="button"
                            onClick={() => handleRemove(tag)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                padding: 0,
                                opacity: 0.7,
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <TagIcon size={16} />
                    </div>
                    <input
                        type="text"
                        className="premium-input"
                        placeholder="Add tag (e.g. dinner, vegan) and press Enter"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => { e.preventDefault(); handleAdd(); }}
                    disabled={!inputValue.trim()}
                >
                    Add
                </button>
            </div>
        </div>
    );
};
