import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login: setAuthUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login({ email, password });
            setAuthUser(user);
            navigate('/cookbook');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <h1 className="nav-logo" style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h1>

                {error && <div className="message-box message-error">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
                        {isLoading ? <Loader2 className="spin" size={20} /> : 'Sign In'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-hover)', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
