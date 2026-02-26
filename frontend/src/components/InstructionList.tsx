import React from 'react';
import { Plus, X } from 'lucide-react';

interface InstructionListProps {
    instructions: string[];
    onChange: (instructions: string[]) => void;
}

export const InstructionList: React.FC<InstructionListProps> = ({ instructions, onChange }) => {
    const addInstruction = () => {
        onChange([...instructions, '']);
    };

    const removeInstruction = (index: number) => {
        const newArr = [...instructions];
        newArr.splice(index, 1);
        onChange(newArr);
    };

    const updateInstruction = (index: number, text: string) => {
        const newArr = [...instructions];
        newArr[index] = text;
        onChange(newArr);
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <div className="flex-between mb-md">
                <label className="input-label" style={{ marginBottom: 0 }}>Instructions</label>
                <button
                    onClick={addInstruction}
                    className="btn-text"
                    style={{ fontSize: '0.8rem' }}
                >
                    <Plus size={14} /> Add Step
                </button>
            </div>

            <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {instructions.map((step, index) => (
                    <div key={index} className="ingredient-row animate-in" style={{ alignItems: 'flex-start' }}>
                        <div className="drag-handle" style={{ padding: '0.5rem 0', marginTop: '0.2rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', width: '1.5rem', display: 'inline-block', textAlign: 'center' }}>
                                {index + 1}.
                            </span>
                        </div>
                        <textarea
                            className="premium-input"
                            style={{ flex: 1, minHeight: '60px', resize: 'vertical', padding: '0.75rem', lineHeight: '1.5' }}
                            placeholder={`e.g., Preheat the oven...`}
                            value={step}
                            onChange={(e) => updateInstruction(index, e.target.value)}
                        />
                        <button
                            onClick={() => removeInstruction(index)}
                            className="btn-icon"
                            style={{ marginTop: '0.2rem' }}
                            title="Remove Step"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            {instructions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px dashed var(--border-subtle)', borderRadius: '0.75rem', color: 'var(--text-muted)' }}>
                    No instructions added yet.
                </div>
            )}
        </div>
    );
};
