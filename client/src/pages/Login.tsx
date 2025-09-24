import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { setAuthToken, setUser as setUserStorage } from '../utils/auth';
import { User, AuthResponse } from '../types';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(formData) as AuthResponse;
      setAuthToken(response.token);
      setUserStorage(response.user);
      setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="logo" style={{ textAlign: 'center', marginBottom: '20px' }}>
        📚 BookReview
      </div>
      <h2 className="form-title">Welcome Back</h2>
      <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
        Sign in to your account to continue
      </p>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email or Username</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email or username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="form-link">
        Don't have an account? <Link to="/register" style={{ color: '#667eea' }}>Create one here</Link>
      </div>
    </div>
  );
};

export default Login;
