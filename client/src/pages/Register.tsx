import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { setAuthToken, setUser as setUserStorage } from '../utils/auth';
import { User, AuthResponse } from '../types';

interface RegisterProps {
  setUser: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }) as AuthResponse;
      
      setAuthToken(response.token);
      setUserStorage(response.user);
      setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="logo" style={{ textAlign: 'center', marginBottom: '20px' }}>
        📚 BookReview
      </div>
      <h2 className="form-title">Create Account</h2>
      <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '30px' }}>
        Join our community of book lovers
      </p>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Choose a unique username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
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
            placeholder="Create a strong password"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="form-link">
        Already have an account? <Link to="/login" style={{ color: '#667eea' }}>Sign in here</Link>
      </div>
    </div>
  );
};

export default Register;
