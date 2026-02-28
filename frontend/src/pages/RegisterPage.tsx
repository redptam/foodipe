import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login: setAuthUser } = useAuth();

    const passwordsMatch = password === confirmPassword;
    const showMismatchedError = confirmPassword.length > 0 && !passwordsMatch;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const user = await register({ name, email, password });
            setAuthUser(user);
            navigate('/cookbook');
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors) {
                const firstError = Object.values(data.errors)[0] as string[];
                setError(firstError?.[0] || data.message || 'Failed to register. Please try again.');
            } else {
                setError(data?.message || 'Failed to register. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h1 className="nav-logo" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Join Foodipe</h1>

                {error && <div className="message-box message-error">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="input-group">
                        <label className="input-label" htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            className="premium-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Gordon Ramsay"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="premium-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="chef@foodipe.com"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="premium-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={`premium-input ${showMismatchedError ? 'error-border' : ''}`}
                            style={showMismatchedError ? { borderColor: 'var(--accent-danger)', boxShadow: '0 0 0 1px var(--accent-danger)' } : {}}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        {showMismatchedError && (
                            <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '0.4rem', display: 'block' }}>
                                Passwords do not match
                            </span>
                        )}
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading || !passwordsMatch} style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
                        {isLoading ? <Loader2 className="spin" size={20} /> : 'Create Account'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent-hover)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
