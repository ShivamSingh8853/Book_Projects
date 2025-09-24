import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const AddBook: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    publishedYear: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'publishedYear' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.author || !formData.genre || !formData.description) {
      setError('All fields are required');
      return;
    }

    if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      setError('Please enter a valid published year');
      return;
    }

    setLoading(true);

    try {
      await api.addBook(formData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2 className="form-title">Add New Book</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="genre">Genre *</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g., Fiction, Science Fiction, Romance..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="publishedYear">Published Year *</label>
          <input
            type="number"
            id="publishedYear"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleChange}
            min="1000"
            max={new Date().getFullYear()}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the book..."
            rows={5}
            required
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
