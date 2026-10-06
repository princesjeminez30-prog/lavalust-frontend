import React, { useState } from 'react';
import api from '../api';

function Login({ setAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', {
                username,
                password,
            });

            const data = response.data;

            if (data.status === 'success' && data.token) {
                localStorage.setItem('token', data.token);

                if (data.user) {
                    localStorage.setItem(
                        'user',
                        JSON.stringify(data.user)
                    );
                }

                setAuth(true);
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Invalid username or password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">PM</div>

                    <h1>Product Manager</h1>
                    <p>Sign in to manage your products</p>
                </div>

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button login-button"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;