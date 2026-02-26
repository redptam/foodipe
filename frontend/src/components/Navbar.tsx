import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="page-title" style={{ fontSize: '1.75rem', marginBottom: 0 }}>Foodipe</span>
            </div>
            <div className="flex-row">
                {user ? (
                    <>
                        <Link
                            to="/cookbook"
                            className="btn-secondary"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                ...(location.pathname === '/cookbook' || location.pathname === '/' ? { background: 'var(--bg-surface-hover)', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'var(--text-primary)' } : { border: '1px solid transparent' })
                            }}
                        >
                            <BookOpen size={18} />
                            Cookbook
                        </Link>
                        <Link to="/save" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', width: 'auto' }}>
                            <PlusCircle size={18} />
                            Add Recipe
                        </Link>
                        <div style={{ width: '1px', height: '2rem', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />
                        <button onClick={handleLogout} className="btn-icon text-muted" title="Logout" style={{ padding: '0.5rem' }}>
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogIn size={18} />
                            Sign In
                        </Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', width: 'auto' }}>
                            <UserPlus size={18} />
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};
