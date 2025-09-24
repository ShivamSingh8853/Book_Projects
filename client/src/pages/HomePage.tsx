import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Great Read</h1>
          <p className="hero-subtitle">
            Join our community of book lovers. Find, review, and share amazing books with readers
            around the world.
          </p>
          <div className="hero-actions">
            <Link to="/books" className="btn-hero primary">
              Browse Books →
            </Link>
            <Link to="/register" className="btn-hero secondary">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2 className="features-title">Why BookReview?</h2>
          <p className="features-subtitle">
            Everything you need to discover, track, and share your reading journey
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Discover Books</h3>
              <p className="feature-description">
                Explore thousands of books across all genres with detailed information and reviews.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3 className="feature-title">Write Reviews</h3>
              <p className="feature-description">
                Share your thoughts and help others discover their next great read.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Join Community</h3>
              <p className="feature-description">
                Connect with fellow book lovers and track your reading journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
